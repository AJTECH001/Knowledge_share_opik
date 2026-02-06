import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTrackedOpenAIClient, flushOpik } from "@/lib/openai-opik";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: issueId } = await params;
  const issue = await prisma.issue.findFirst({
    where: { id: issueId, authorId: session.user.id },
    include: { subject: true },
  });
  if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  if (issue.status !== "open") {
    return NextResponse.json({ error: "Issue already matched or resolved" }, { status: 400 });
  }

  const experts = await prisma.userSubject.findMany({
    where: { subjectId: issue.subjectId, role: "expert", userId: { not: session.user.id } },
    include: {
      user: { include: { profile: true } },
    },
  });

  if (experts.length === 0) {
    return NextResponse.json({
      matches: [],
      message: "No experts registered for this subject yet. Check back later.",
    });
  }

  const trackedOpenAI = getTrackedOpenAIClient();
  const prompt = `You are matching a learner's issue with the best available experts.

Issue:
- Subject: ${issue.subject.name}
- Title: ${issue.title}
- Description: ${issue.description}
${issue.triedSoFar ? `- What they tried: ${issue.triedSoFar}` : ""}

Experts (reply with a JSON object with key "expert_ids" = array of user IDs in order of best match, best first):
${experts.map((e) => `- ID: ${e.user.id} | Name: ${e.user.name ?? "Unknown"} | Expertise: ${e.user.profile?.expertise ?? "—"}`).join("\n")}

Reply only with JSON, e.g. {"expert_ids": ["id1","id2"]}`;

  let orderedIds: string[] = [];
  try {
    const completion = await trackedOpenAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    await flushOpik();

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = (() => {
      try {
        const o = JSON.parse(content) as { expert_ids?: string[] };
        return o.expert_ids ?? [];
      } catch {
        const m = content.match(/\[[\s\S]*?\]/);
        return m ? (JSON.parse(m[0]) as string[]) : [];
      }
    })();
    orderedIds = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    await flushOpik();
    return NextResponse.json(
      { error: "Matching service unavailable. Please try again.", details: String(e) },
      { status: 503 }
    );
  }

  const expertIds = new Set(experts.map((e) => e.user.id));
  const topExpertIds = orderedIds.filter((id) => expertIds.has(id));
  if (topExpertIds.length === 0) topExpertIds.push(experts[0].user.id);

  const created: { matchId: string; expertId: string; expertName: string | null }[] = [];
  for (const expertId of topExpertIds.slice(0, 5)) {
    const existing = await prisma.match.findUnique({
      where: { issueId_expertId: { issueId, expertId } },
    });
    if (existing) continue;
    const match = await prisma.match.create({
      data: { issueId, learnerId: session.user.id, expertId, status: "pending" },
      include: { expert: true },
    });
    created.push({
      matchId: match.id,
      expertId: match.expertId,
      expertName: match.expert.name,
    });
  }

  if (created.length > 0) {
    await prisma.issue.update({
      where: { id: issueId },
      data: { status: "matched" },
    });
  }

  return NextResponse.json({
    matches: created,
    message:
      created.length > 0
        ? `Matched with ${created.length} expert(s). Check your dashboard for conversations.`
        : "No new matches created.",
  });
}

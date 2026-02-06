import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { matchId, scheduledAt, type, location } = body as {
    matchId: string;
    scheduledAt: string;
    type?: string;
    location?: string;
  };

  if (!matchId || !scheduledAt) return NextResponse.json({ error: "Missing matchId or scheduledAt" }, { status: 400 });

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ learnerId: session.user.id }, { expertId: session.user.id }],
    },
  });
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  await prisma.meeting.create({
    data: {
      matchId,
      learnerId: match.learnerId,
      expertId: match.expertId,
      scheduledAt: new Date(scheduledAt),
      type: type ?? "online",
      location: location ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { matchId, content } = (await req.json()) as { matchId: string; content: string };
  if (!matchId || !content?.trim()) return NextResponse.json({ error: "Missing matchId or content" }, { status: 400 });

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ learnerId: session.user.id }, { expertId: session.user.id }],
    },
  });
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  const message = await prisma.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      content: content.trim(),
    },
  });

  return NextResponse.json({ id: message.id });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { subjectId, title, description, triedSoFar } = body as {
    subjectId: string;
    title: string;
    description: string;
    triedSoFar?: string;
  };

  if (!subjectId || !title || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const issue = await prisma.issue.create({
    data: {
      authorId: session.user.id,
      subjectId,
      title,
      description,
      triedSoFar: triedSoFar ?? null,
    },
  });

  return NextResponse.json({ id: issue.id });
}

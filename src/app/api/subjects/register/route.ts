import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, role } = (await req.json()) as { subjectId: string; role: "learner" | "expert" };
  if (!subjectId || !role) return NextResponse.json({ error: "Missing subjectId or role" }, { status: 400 });

  await prisma.userSubject.upsert({
    where: {
      userId_subjectId: { userId: session.user.id, subjectId },
    },
    create: { userId: session.user.id, subjectId, role },
    update: { role },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = (await req.json()) as { subjectId: string };
  if (!subjectId) return NextResponse.json({ error: "Missing subjectId" }, { status: 400 });

  await prisma.userSubject.deleteMany({
    where: { userId: session.user.id, subjectId },
  });

  return NextResponse.json({ ok: true });
}

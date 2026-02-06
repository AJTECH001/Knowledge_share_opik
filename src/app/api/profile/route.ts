import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { bio, expertise, interests } = body as { bio?: string; expertise?: string; interests?: string };

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      bio: bio ?? "",
      expertise: expertise ?? "",
      interests: interests ?? "",
    },
    update: {
      bio: bio ?? undefined,
      expertise: expertise ?? undefined,
      interests: interests ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

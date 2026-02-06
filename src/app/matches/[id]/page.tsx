import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChatPanel } from "./ChatPanel";
import { MeetingSection } from "./MeetingSection";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;
  const match = await prisma.match.findFirst({
    where: {
      id,
      OR: [{ learnerId: session.user.id }, { expertId: session.user.id }],
    },
    include: {
      issue: { include: { subject: true } },
      learner: true,
      expert: true,
      meetings: true,
    },
  });
  if (!match) notFound();

  const other = session.user.id === match.learnerId ? match.expert : match.learner;
  const messages = await prisma.message.findMany({
    where: { matchId: id },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <Link href="/dashboard" className="text-brand-600 hover:underline">Dashboard</Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 flex flex-col">
        <div className="card mb-4">
          <h1 className="font-bold text-brand-800">{match.issue.title}</h1>
          <p className="text-sm text-brand-600">{match.issue.subject.name} · with {other.name ?? other.email}</p>
        </div>

        <div className="flex-1 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChatPanel matchId={id} initialMessages={messages} currentUserId={session.user.id} />
          </div>
          <div>
            <MeetingSection match={match} currentUserId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}

import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MatchButton } from "./MatchButton";

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;
  const issue = await prisma.issue.findFirst({
    where: { id, authorId: session.user.id },
    include: {
      subject: true,
      matches: { include: { expert: true } },
    },
  });
  if (!issue) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <Link href="/dashboard" className="text-brand-600 hover:underline">Dashboard</Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-800">{issue.title}</h1>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">{issue.status}</span>
          </div>
          <p className="mt-2 text-sm text-brand-600">{issue.subject.name}</p>
          <div className="mt-4 text-brand-700 whitespace-pre-wrap">{issue.description}</div>
          {issue.triedSoFar && (
            <div className="mt-4 pt-4 border-t border-brand-200">
              <h3 className="text-sm font-medium text-brand-700">What I&apos;ve tried</h3>
              <p className="mt-1 text-brand-600 whitespace-pre-wrap">{issue.triedSoFar}</p>
            </div>
          )}
          {issue.status === "open" && (
            <div className="mt-6">
              <MatchButton issueId={issue.id} />
            </div>
          )}
        </div>

        {issue.matches.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-brand-800">Matched experts</h2>
            <ul className="mt-4 space-y-3">
              {issue.matches.map((m) => (
                <li key={m.id} className="card flex items-center justify-between">
                  <span>{m.expert.name ?? m.expert.email}</span>
                  <Link href={`/matches/${m.id}`} className="btn-primary text-sm">Open chat</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const [issues, matches, profile] = await Promise.all([
    prisma.issue.findMany({
      where: { authorId: session.user.id },
      include: { subject: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.match.findMany({
      where: { OR: [{ learnerId: session.user.id }, { expertId: session.user.id }] },
      include: { issue: { include: { subject: true } }, learner: true, expert: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <nav className="flex items-center gap-4">
            <Link href="/profile" className="text-brand-600 hover:underline">Profile</Link>
            <Link href="/subjects" className="text-brand-600 hover:underline">Subjects</Link>
            <Link href="/api/auth/signout" className="btn-secondary">Sign out</Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-800">Dashboard</h1>
        {!profile && (
          <div className="mt-4 card border-brand-400 bg-brand-50">
            <p className="text-brand-700">
              Complete your <Link href="/profile" className="font-medium underline">profile</Link> and register for subjects so you can report issues or help others.
            </p>
          </div>
        )}

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-800">My issues</h2>
            <Link href="/issues/new" className="btn-primary">Report an issue</Link>
          </div>
          {issues.length === 0 ? (
            <p className="mt-4 text-brand-600">You haven&apos;t reported any issues yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {issues.map((issue) => (
                <li key={issue.id} className="card">
                  <Link href={`/issues/${issue.id}`} className="block">
                    <span className="font-medium text-brand-800">{issue.title}</span>
                    <span className="ml-2 text-sm text-brand-600">({issue.subject.name})</span>
                    <span className="ml-2 text-sm text-brand-500">— {issue.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-brand-800">Matches & conversations</h2>
          {matches.length === 0 ? (
            <p className="mt-4 text-brand-600">No matches yet. Report an issue to get matched with an expert.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {matches.map((m) => (
                <li key={m.id} className="card flex items-center justify-between">
                  <div>
                    <span className="font-medium text-brand-800">{m.issue.title}</span>
                    <span className="ml-2 text-sm text-brand-600">
                      with {session.user.id === m.learnerId ? m.expert.name : m.learner.name}
                    </span>
                    <span className="ml-2 text-sm text-brand-500">— {m.status}</span>
                  </div>
                  <Link href={`/matches/${m.id}`} className="btn-secondary text-sm">Open chat</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

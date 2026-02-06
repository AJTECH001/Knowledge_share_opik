import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NewIssueForm } from "./NewIssueForm";

export default async function NewIssuePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  const userSubjectIds = await prisma.userSubject.findMany({
    where: { userId: session.user.id, role: "learner" },
    select: { subjectId: true },
  }).then((r) => r.map((x) => x.subjectId));

  const availableSubjects = subjects.filter((s) => userSubjectIds.includes(s.id));
  if (availableSubjects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-brand-700">
          Register as a learner for at least one <Link href="/subjects" className="underline">subject</Link> before reporting an issue.
        </p>
        <Link href="/dashboard" className="mt-4 btn-primary">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <Link href="/dashboard" className="text-brand-600 hover:underline">Dashboard</Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-800">Report an issue</h1>
        <p className="mt-2 text-brand-600">
          Describe what you&apos;re stuck on. We&apos;ll match you with an expert in that subject.
        </p>
        <NewIssueForm subjects={availableSubjects} />
      </main>
    </div>
  );
}

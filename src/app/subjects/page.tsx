import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SubjectList } from "./SubjectList";

export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const [subjects, userSubjects] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.userSubject.findMany({
      where: { userId: session.user.id },
      include: { subject: true },
    }),
  ]);

  const registeredIds = new Set(userSubjects.map((us) => us.subjectId));
  const bySubject = Object.fromEntries(userSubjects.map((us) => [us.subjectId, us.role]));

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-brand-600 hover:underline">Dashboard</Link>
            <Link href="/profile" className="text-brand-600 hover:underline">Profile</Link>
            <Link href="/api/auth/signout" className="btn-secondary">Sign out</Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-800">Subjects</h1>
        <p className="mt-2 text-brand-600">
          Register as a learner (want to learn) or expert (can teach) for each subject.
        </p>
        <SubjectList
          subjects={subjects}
          registeredIds={Array.from(registeredIds)}
          roleBySubject={bySubject}
        />
      </main>
    </div>
  );
}

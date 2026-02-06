import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const [profile, userSubjects] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.userSubject.findMany({
      where: { userId: session.user.id },
      include: { subject: true },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">KnowledgeShare</Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-brand-600 hover:underline">Dashboard</Link>
            <Link href="/subjects" className="text-brand-600 hover:underline">Subjects</Link>
            <Link href="/api/auth/signout" className="btn-secondary">Sign out</Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-800">Your profile</h1>
        <ProfileForm
          userId={session.user.id}
          initialBio={profile?.bio ?? ""}
          initialExpertise={profile?.expertise ?? ""}
          initialInterests={profile?.interests ?? ""}
        />
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-brand-800">Registered subjects</h2>
          {userSubjects.length === 0 ? (
            <p className="mt-2 text-brand-600">
              <Link href="/subjects" className="underline">Register for subjects</Link> to learn or teach.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {userSubjects.map((us) => (
                <li key={us.id} className="flex items-center justify-between rounded-lg border border-brand-200 bg-white px-4 py-2">
                  <span>{us.subject.name}</span>
                  <span className="text-sm text-brand-600">{us.role}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

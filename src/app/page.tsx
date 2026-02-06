import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-brand-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-brand-700">
            KnowledgeShare
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-brand-600 hover:underline">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-brand-600 hover:underline">
                  Profile
                </Link>
                <Link href="/api/auth/signout" className="btn-secondary">
                  Sign out
                </Link>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-primary">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1 mx-auto w-full max-w-6xl px-4 py-16">
        <section className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-800 tracking-tight sm:text-5xl">
            Share your knowledge. Grow together.
          </h1>
          <p className="mt-4 text-lg text-brand-600">
            Connect with experts who can help you overcome learning blocks, or offer guidance in subjects you know well. Real-time support in a safe, structured environment.
          </p>
          {!session && (
            <div className="mt-8">
              <Link href="/auth/signin" className="btn-primary text-base px-6 py-3">
                Get started
              </Link>
            </div>
          )}
        </section>

        <section className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="font-semibold text-brand-800">Create your profile</h3>
            <p className="mt-2 text-sm text-brand-600">
              Showcase your expertise and interests so learners and experts can find you.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-brand-800">Report issues</h3>
            <p className="mt-2 text-sm text-brand-600">
              Describe what you&apos;re stuck on and what you&apos;ve tried. We match you with the right expert.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-brand-800">Meet & chat</h3>
            <p className="mt-2 text-sm text-brand-600">
              Schedule online or in-person meetings and use real-time chat to get unblocked.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

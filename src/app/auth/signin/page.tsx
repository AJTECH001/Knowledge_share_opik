"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        name: name || undefined,
        redirect: false,
      });
      if (res?.error) {
        setError("Sign in failed. Please try again.");
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-800">Sign in to KnowledgeShare</h1>
        <p className="mt-2 text-sm text-brand-600">
          Enter your email to continue. We&apos;ll create an account if you don&apos;t have one.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-700">
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-brand-600">
          <Link href="/" className="hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}

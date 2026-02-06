"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewIssueForm({
  subjects,
}: {
  subjects: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [triedSoFar, setTriedSoFar] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          title,
          description,
          triedSoFar: triedSoFar || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/issues/${data.id}`);
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 card">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-brand-700">Subject</label>
        <select
          id="subject"
          className="input mt-1"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-brand-700">Title</label>
        <input
          id="title"
          type="text"
          className="input mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Short summary of your issue"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-brand-700">Description</label>
        <textarea
          id="description"
          className="input mt-1 min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="What exactly is the problem?"
        />
      </div>
      <div>
        <label htmlFor="tried" className="block text-sm font-medium text-brand-700">What you&apos;ve tried so far</label>
        <textarea
          id="tried"
          className="input mt-1 min-h-[80px]"
          value={triedSoFar}
          onChange={(e) => setTriedSoFar(e.target.value)}
          placeholder="Optional: resources you used, steps you took"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Submit & find experts"}
      </button>
    </form>
  );
}

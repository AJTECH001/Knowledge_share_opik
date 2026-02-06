"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubjectList({
  subjects,
  registeredIds,
  roleBySubject,
}: {
  subjects: { id: string; name: string; description: string | null }[];
  registeredIds: string[];
  roleBySubject: Record<string, string>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function register(subjectId: string, role: "learner" | "expert") {
    setLoading(subjectId);
    try {
      const res = await fetch("/api/subjects/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, role }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(subjectId);
    }
  }

  async function unregister(subjectId: string) {
    setLoading(subjectId);
    try {
      const res = await fetch("/api/subjects/register", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <ul className="mt-6 space-y-4">
      {subjects.map((s) => {
        const registered = registeredIds.includes(s.id);
        const role = roleBySubject[s.id];
        const busy = loading === s.id;
        return (
          <li key={s.id} className="card flex items-center justify-between">
            <div>
              <span className="font-medium text-brand-800">{s.name}</span>
              {s.description && (
                <p className="mt-1 text-sm text-brand-600">{s.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {registered ? (
                <>
                  <span className="text-sm text-brand-600">({role})</span>
                  <button
                    type="button"
                    onClick={() => unregister(s.id)}
                    className="btn-secondary text-sm"
                    disabled={busy}
                  >
                    Unregister
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => register(s.id, "learner")}
                    className="btn-secondary text-sm"
                    disabled={busy}
                  >
                    Learn
                  </button>
                  <button
                    type="button"
                    onClick={() => register(s.id, "expert")}
                    className="btn-primary text-sm"
                    disabled={busy}
                  >
                    Teach
                  </button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

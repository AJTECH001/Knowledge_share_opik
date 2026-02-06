"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MatchButton({ issueId }: { issueId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleMatch() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/issues/${issueId}/match`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message ?? "Matching complete.");
        router.refresh();
      } else {
        setMessage(data.error ?? data.details ?? "Matching failed.");
      }
    } catch {
      setMessage("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleMatch}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Finding experts…" : "Find experts"}
      </button>
      {message && <p className="mt-2 text-sm text-brand-600">{message}</p>}
    </div>
  );
}

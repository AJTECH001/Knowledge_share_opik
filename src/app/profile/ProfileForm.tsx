"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileForm({
  userId: _userId,
  initialBio,
  initialExpertise,
  initialInterests,
}: {
  userId: string;
  initialBio: string;
  initialExpertise: string;
  initialInterests: string;
}) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [expertise, setExpertise] = useState(initialExpertise);
  const [interests, setInterests] = useState(initialInterests);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, expertise, interests }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 card">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-brand-700">Bio</label>
        <textarea
          id="bio"
          className="input mt-1 min-h-[100px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short intro about you"
        />
      </div>
      <div>
        <label htmlFor="expertise" className="block text-sm font-medium text-brand-700">Expertise (subjects you can teach)</label>
        <input
          id="expertise"
          type="text"
          className="input mt-1"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          placeholder="e.g. Math, Physics, JavaScript"
        />
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-brand-700">Interests (subjects you want to learn)</label>
        <input
          id="interests"
          type="text"
          className="input mt-1"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. Spanish, Machine Learning"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

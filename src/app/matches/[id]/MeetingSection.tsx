"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

type Match = {
  id: string;
  learnerId: string;
  expertId: string;
  meetings: {
    id: string;
    scheduledAt: string | Date;
    type: string;
    location: string | null;
    status: string;
  }[];
};

export function MeetingSection({ match, currentUserId: _currentUserId }: { match: Match; currentUserId: string }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"online" | "physical">("online");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function schedule() {
    if (!date || !time) return;
    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          scheduledAt,
          type,
          location: location || undefined,
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="font-semibold text-brand-800 mb-3">Schedule a meeting</h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as "online" | "physical")}
        >
          <option value="online">Online</option>
          <option value="physical">In person</option>
        </select>
        <input
          type="text"
          className="input"
          placeholder={type === "online" ? "Meeting link (e.g. Zoom)" : "Address"}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          type="button"
          onClick={schedule}
          className="btn-primary w-full"
          disabled={loading || !date || !time}
        >
          {loading ? "Scheduling…" : "Schedule"}
        </button>
      </div>
      {match.meetings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-brand-200">
          <h3 className="text-sm font-medium text-brand-700">Upcoming</h3>
          <ul className="mt-2 space-y-2">
            {match.meetings
              .filter((m) => m.status === "scheduled")
              .map((m) => (
                <li key={m.id} className="text-sm text-brand-600">
                  {format(new Date(m.scheduledAt), "PPp")} · {m.type}
                  {m.location && ` · ${m.location}`}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

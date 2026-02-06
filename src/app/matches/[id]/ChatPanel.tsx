"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { name: string | null; email: string | null };
};

export function ChatPanel({
  matchId,
  initialMessages,
  currentUserId,
}: {
  matchId: string;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, content: text }),
      });
      const data = await res.json();
      if (data.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            content: text,
            createdAt: new Date().toISOString(),
            senderId: currentUserId,
            sender: { name: null, email: null },
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex flex-col h-[400px]">
      <h2 className="font-semibold text-brand-800 mb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-sm text-brand-500">No messages yet. Say hello!</p>
        )}
        {messages.map((m) => {
          const isMe = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  isMe ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-800"
                }`}
              >
                {!isMe && (
                  <p className="text-xs opacity-80">{m.sender.name ?? m.sender.email ?? "Expert"}</p>
                )}
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-brand-200">
        <input
          type="text"
          className="input flex-1"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
        />
        <button
          type="button"
          onClick={send}
          className="btn-primary"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

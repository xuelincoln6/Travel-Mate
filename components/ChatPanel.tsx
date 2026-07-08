"use client";

import { useState } from "react";
import type { ChatMessage, TripPlan } from "@/types/trip";

type ChatPanelProps = {
  plan: TripPlan;
  onPlanChange: (plan: TripPlan) => void;
};

export function ChatPanel({ plan, onPlanChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Your ${plan.request.destination} plan is ready. Tell me what to change.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    const trimmed = input.trim();

    if (!trimmed || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, messages: nextMessages })
      });
      const data = (await response.json()) as {
        reply?: string;
        itinerary?: TripPlan["itinerary"];
        error?: string;
      };

      if (!response.ok || !data.itinerary) {
        throw new Error(data.error ?? "Unable to update itinerary.");
      }

      onPlanChange({ ...plan, itinerary: data.itinerary });
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? "Updated." }]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col rounded-3xl border border-line bg-white p-4 shadow-soft lg:min-w-80">
      <div className="border-b border-line pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">AI Planner</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">Chat</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((message, index) => (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-8 bg-ink text-white"
                : "mr-8 bg-mist text-ink"
            }`}
            key={`${message.role}-${index}`}
          >
            {message.content}
          </div>
        ))}
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="border-t border-line pt-4">
        <textarea
          className="min-h-24 w-full resize-none rounded-2xl border border-line bg-mist px-4 py-3 text-sm text-ink"
          placeholder="Try: I only have a budget of AUD 1500."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button
          className="mt-3 w-full rounded-2xl bg-ocean px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSending}
          onClick={() => void sendMessage()}
          type="button"
        >
          {isSending ? "Updating..." : "Update Itinerary"}
        </button>
      </div>
    </aside>
  );
}

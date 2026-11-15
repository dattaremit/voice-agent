"use client";

import { usePipecatConversation } from "@pipecat-ai/client-react";
import { cn } from "@/lib/utils";
import { messageText } from "./message-text";

const speakers = { user: "Patient", assistant: "Agent" } as const;

export function Transcript() {
  const { messages } = usePipecatConversation();
  const turns = messages.filter((message) => message.role === "user" || message.role === "assistant");
  if (turns.length === 0) return <p className="text-sm text-muted-foreground">The transcript appears here once the call starts.</p>;
  return (
    <ol className="space-y-3">
      {turns.map((message) => (
        <li
          key={message.createdAt}
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
            message.role === "assistant" ? "bg-secondary" : "ml-auto bg-primary text-primary-foreground",
          )}
        >
          <span className="block text-xs opacity-70">{speakers[message.role as keyof typeof speakers]}</span>
          {messageText(message)}
        </li>
      ))}
    </ol>
  );
}

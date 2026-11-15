import type { ConversationMessage } from "@pipecat-ai/client-react";

const partText = (text: unknown) =>
  typeof text === "object" && text !== null && "spoken" in text ? String(text.spoken) : String(text ?? "");

export const messageText = (message: ConversationMessage) =>
  message.parts.map((part) => partText(part.text)).join(" ").trim();

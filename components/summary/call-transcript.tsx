import { SectionCard } from "@/components/shared/section-card";
import { TranscriptBubble } from "@/components/shared/transcript-bubble";
import { listCallTurns } from "@/lib/repositories/call-turns";

export async function CallTranscript({ callId }: { callId: string }) {
  const turns = await listCallTurns(callId);
  return (
    <SectionCard title="Transcript">
      {turns.length === 0 ? (
        <p className="text-sm text-muted-foreground">The patient did not speak during this call.</p>
      ) : (
        <ol className="space-y-3">
          {turns.map((turn) => (
            <TranscriptBubble key={turn.id} speaker={turn.role}>
              {turn.text}
            </TranscriptBubble>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}

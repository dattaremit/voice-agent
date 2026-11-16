import { DetailList } from "@/components/shared/detail-list";
import { SectionCard } from "@/components/shared/section-card";
import { humanizeKey } from "@/lib/format";
import { listCallAnswers } from "@/lib/repositories/call-answers";

export async function RecordedAnswers({ callId }: { callId: string }) {
  const answers = await listCallAnswers(callId);
  return (
    <SectionCard title="Intake answers">
      {answers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No answers were recorded.</p>
      ) : (
        <DetailList items={answers.map((answer) => ({ label: humanizeKey(answer.questionKey), value: String(answer.value) }))} />
      )}
    </SectionCard>
  );
}

import { BulletList } from "@/components/shared/bullet-list";
import { LabeledBlock } from "@/components/shared/labeled-block";
import { SectionCard } from "@/components/shared/section-card";
import type { CallSummary } from "@/lib/schemas/call-summary";
import { TriageBadge } from "./triage-badge";

export function CallSummaryCard({ summary }: { summary: CallSummary }) {
  return (
    <SectionCard title="Clinician summary" action={<TriageBadge level={summary.triageLevel} />}>
      <div className="space-y-6">
        <p className="leading-relaxed">{summary.summary}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <LabeledBlock label="Reason for visit">
            <p className="text-sm">{summary.reasonForVisit}</p>
          </LabeledBlock>
          <LabeledBlock label="Appointment">
            <p className="text-sm">{summary.appointment}</p>
          </LabeledBlock>
          <LabeledBlock label="Red flags">
            <BulletList items={summary.redFlags} empty="None reported." />
          </LabeledBlock>
          <LabeledBlock label="Actions">
            <BulletList items={summary.actions} empty="No actions needed." />
          </LabeledBlock>
          <LabeledBlock label="Symptoms">
            <BulletList items={summary.symptoms} empty="None reported." />
          </LabeledBlock>
        </div>
      </div>
    </SectionCard>
  );
}

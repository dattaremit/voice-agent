import { type BadgeStyle, EnumBadge } from "@/components/shared/enum-badge";
import type { CallSummary } from "@/modules/summaries/call-summary";

type TriageLevel = CallSummary["triageLevel"];

const triageStyles: Record<TriageLevel, BadgeStyle> = {
  routine: { label: "Routine", variant: "secondary" },
  follow_up: { label: "Follow-up needed", variant: "default" },
  urgent: { label: "Urgent", variant: "destructive" },
};

export function TriageBadge({ level }: { level: TriageLevel }) {
  return <EnumBadge value={level} styles={triageStyles} />;
}

import { type BadgeStyle, EnumBadge } from "@/components/shared/enum-badge";
import type { CallStatus } from "@/lib/repositories/calls";

const statusStyles: Record<CallStatus, BadgeStyle> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  in_progress: { label: "In progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  return <EnumBadge value={status} styles={statusStyles} />;
}

import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import type { CallStatus } from "@/lib/repositories/calls";

const statusStyles: Record<CallStatus, { label: string; variant: ComponentProps<typeof Badge>["variant"] }> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  in_progress: { label: "In progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const { label, variant } = statusStyles[status];
  return <Badge variant={variant}>{label}</Badge>;
}

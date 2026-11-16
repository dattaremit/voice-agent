import { Loader2 } from "lucide-react";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import { SectionCard } from "@/components/shared/section-card";

export function SummaryPending({ message }: { message: string }) {
  return (
    <SectionCard title="Clinician summary">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {message}
      </p>
      <AutoRefresh intervalMs={3000} />
    </SectionCard>
  );
}

import type { ReactNode } from "react";

export function LabeledBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      {children}
    </div>
  );
}

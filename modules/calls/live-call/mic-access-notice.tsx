import type { ReactNode } from "react";
import { Mic } from "lucide-react";

export function MicAccessNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Mic className="size-4" />
        </span>
        <div className="space-y-0.5">
          <p className="font-medium">{title}</p>
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

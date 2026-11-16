import type { ReactNode } from "react";

export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">{children}</main>;
}

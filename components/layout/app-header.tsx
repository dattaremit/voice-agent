import Link from "next/link";
import { Snowflake } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Snowflake className="size-4" />
          </span>
          Patient Follow-Up
        </Link>
      </div>
    </header>
  );
}

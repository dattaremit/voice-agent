import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { listCallsForVisit } from "@/lib/repositories/calls";
import { CallStatusBadge } from "./call-status-badge";

export async function CallHistory({ visitId }: { visitId: string }) {
  const calls = await listCallsForVisit(visitId);
  if (calls.length === 0) return <p className="text-sm text-muted-foreground">No follow-up calls yet.</p>;
  return (
    <ul className="divide-y">
      {calls.map((call) => (
        <li key={call.id}>
          <Link href={`/calls/${call.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
            <span className="text-sm">{formatDateTime(call.createdAt)}</span>
            <span className="flex items-center gap-2">
              <CallStatusBadge status={call.status} />
              <ChevronRight className="size-4 text-muted-foreground" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

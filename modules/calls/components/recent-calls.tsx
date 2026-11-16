import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format/format-date";
import { listRecentCalls } from "@/modules/calls/call-repository";
import { CallStatusBadge } from "@/modules/calls/components/call-status-badge";
import { callerName } from "@/modules/calls/components/caller-name";

const recentCallLimit = 8;

export async function RecentCalls() {
  const calls = await listRecentCalls(recentCallLimit);
  return (
    <Card>
      <CardContent>
        {calls.length === 0 ? (
          <p className="text-sm text-muted-foreground">No calls yet.</p>
        ) : (
          <ul className="divide-y">
            {calls.map((call) => (
              <li key={call.id}>
                <Link href={`/calls/${call.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                  <span className="text-sm">
                    <span className="font-medium">{callerName(call.patientName)}</span>
                    <span className="block text-muted-foreground">{formatDateTime(call.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CallStatusBadge status={call.status} />
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { VisitListItem } from "@/lib/repositories/visits";

export function VisitRow({ visit }: { visit: VisitListItem }) {
  return (
    <TableRow>
      <TableCell className="px-6 py-4 font-medium">
        <Link href={`/visits/${visit.id}`} className="hover:text-primary hover:underline underline-offset-4">
          {visit.patientName}
        </Link>
      </TableCell>
      <TableCell className="px-6 py-4">{visit.reason}</TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground">{formatDate(visit.visitDate)}</TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground">{visit.clinicianName}</TableCell>
    </TableRow>
  );
}

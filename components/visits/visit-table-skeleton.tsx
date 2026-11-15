import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { VisitTableFrame } from "./visit-table-frame";

const rows = [0, 1, 2];
const cells = [0, 1, 2, 3];

export function VisitTableSkeleton() {
  return (
    <VisitTableFrame>
      {rows.map((row) => (
        <TableRow key={row}>
          {cells.map((cell) => (
            <TableCell key={cell} className="px-6 py-4">
              <Skeleton className="h-4 w-28" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </VisitTableFrame>
  );
}

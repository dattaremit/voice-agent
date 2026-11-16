import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { DataTable } from "./data-table";

const rows = [0, 1, 2];

export function TableSkeleton({ columns }: { columns: string[] }) {
  return (
    <DataTable columns={columns}>
      {rows.map((row) => (
        <TableRow key={row}>
          {columns.map((column) => (
            <TableCell key={column} className="px-6 py-4">
              <Skeleton className="h-4 w-28" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </DataTable>
  );
}

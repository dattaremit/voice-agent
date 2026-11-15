import { listVisits } from "@/lib/repositories/visits";
import { VisitRow } from "./visit-row";
import { VisitTableFrame } from "./visit-table-frame";

export async function VisitTable() {
  const visits = await listVisits();
  return (
    <VisitTableFrame>
      {visits.map((visit) => (
        <VisitRow key={visit.id} visit={visit} />
      ))}
    </VisitTableFrame>
  );
}

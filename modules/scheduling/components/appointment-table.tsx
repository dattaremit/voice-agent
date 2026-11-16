import { connection } from "next/server";
import { DataTable } from "@/components/shared/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { listUpcomingAppointments } from "@/modules/scheduling/appointment-repository";
import { APPOINTMENT_COLUMNS } from "@/modules/scheduling/components/appointment-columns";
import { AppointmentRow } from "@/modules/scheduling/components/appointment-row";

export async function AppointmentTable() {
  await connection();
  const appointments = await listUpcomingAppointments(new Date());
  return (
    <DataTable columns={APPOINTMENT_COLUMNS}>
      {appointments.length === 0 ? (
        <TableRow>
          <TableCell colSpan={APPOINTMENT_COLUMNS.length} className="px-6 py-6 text-center text-muted-foreground">
            No upcoming appointments.
          </TableCell>
        </TableRow>
      ) : (
        appointments.map((appointment) => <AppointmentRow key={appointment.id} appointment={appointment} />)
      )}
    </DataTable>
  );
}

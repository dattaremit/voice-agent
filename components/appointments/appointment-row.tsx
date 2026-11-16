import { TableCell, TableRow } from "@/components/ui/table";
import type { AppointmentListItem } from "@/lib/repositories/appointments";
import { clinicLabel } from "@/lib/scheduling/zoned-time";

export function AppointmentRow({ appointment }: { appointment: AppointmentListItem }) {
  return (
    <TableRow>
      <TableCell className="px-6 py-4 font-medium">{clinicLabel(appointment.startsAt)}</TableCell>
      <TableCell className="px-6 py-4">{appointment.patientName}</TableCell>
      <TableCell className="px-6 py-4">
        {appointment.clinicianName}
        <span className="block text-xs text-muted-foreground">{appointment.specialty}</span>
      </TableCell>
      <TableCell className="px-6 py-4 text-muted-foreground">{appointment.reason}</TableCell>
    </TableRow>
  );
}

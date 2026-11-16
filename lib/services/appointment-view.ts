import type { AppointmentListItem } from "@/lib/repositories/appointments";
import { clinicLabel } from "@/lib/scheduling/zoned-time";

export const appointmentView = (appointment: AppointmentListItem) => ({
  appointmentId: appointment.id,
  when: clinicLabel(appointment.startsAt),
  clinicianName: appointment.clinicianName,
  reason: appointment.reason,
});

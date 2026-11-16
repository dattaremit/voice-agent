import type { AppointmentListItem } from "@/modules/scheduling/appointment-repository";
import { clinicLabel } from "@/modules/scheduling/zoned-time";

export const appointmentView = (appointment: AppointmentListItem) => ({
  appointmentId: appointment.id,
  when: clinicLabel(appointment.startsAt),
  clinicianName: appointment.clinicianName,
  reason: appointment.reason,
});

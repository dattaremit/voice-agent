import { insertAppointment } from "@/modules/scheduling/appointment-repository";
import { getClinician } from "@/modules/scheduling/clinician-repository";
import type { BookingRequest } from "@/modules/scheduling/booking-request";
import { isBookableSlot } from "@/modules/scheduling/slot-grid";
import { clinicLabel } from "@/modules/scheduling/zoned-time";

export type BookingResult =
  | { booked: true; appointmentId: string; when: string; clinicianName: string }
  | { booked: false; reason: "unknown_clinician" | "outside_clinic_hours" | "slot_taken" };

export async function bookAppointment(
  callId: string,
  patientId: string,
  request: BookingRequest,
  now = new Date(),
): Promise<BookingResult> {
  const clinician = await getClinician(request.clinicianId);
  if (!clinician) return { booked: false, reason: "unknown_clinician" };
  const startsAt = new Date(request.startsAt);
  if (!isBookableSlot(startsAt, now)) return { booked: false, reason: "outside_clinic_hours" };
  const created = await insertAppointment({ callId, patientId, clinicianId: clinician.id, startsAt, reason: request.reason });
  if (!created) return { booked: false, reason: "slot_taken" };
  return { booked: true, appointmentId: created.id, when: clinicLabel(startsAt), clinicianName: clinician.name };
}

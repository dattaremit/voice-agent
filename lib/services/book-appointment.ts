import type { z } from "zod";
import { insertAppointment } from "@/lib/repositories/appointments";
import { getClinician } from "@/lib/repositories/clinicians";
import type { bookingRequestSchema } from "@/lib/schemas/scheduling-requests";
import { isBookableSlot } from "@/lib/scheduling/slot-grid";
import { clinicLabel } from "@/lib/scheduling/zoned-time";

type BookingRequest = z.infer<typeof bookingRequestSchema>;

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

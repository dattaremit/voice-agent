import { listBookedSlotsSince } from "@/modules/scheduling/appointment-repository";
import { type Clinician, listClinicians } from "@/modules/scheduling/clinician-repository";
import type { AvailabilityRequest } from "@/modules/scheduling/availability-request";
import { AFTERNOON_START_HOUR } from "@/modules/scheduling/clinic-hours";
import { bookableSlots } from "@/modules/scheduling/slot-grid";
import { clinicDateKey, clinicHour, clinicLabel } from "@/modules/scheduling/zoned-time";

const maxSlots = 6;

const matchesClinician = (clinician: Clinician, request: AvailabilityRequest) =>
  (!request.clinicianId || clinician.id === request.clinicianId) &&
  (!request.specialty || clinician.specialty.toLowerCase() === request.specialty.toLowerCase());

const matchesTime = (slot: Date, request: AvailabilityRequest) => {
  if (request.date && clinicDateKey(slot) !== request.date) return false;
  if (request.partOfDay === "morning") return clinicHour(slot) < AFTERNOON_START_HOUR;
  if (request.partOfDay === "afternoon") return clinicHour(slot) >= AFTERNOON_START_HOUR;
  return true;
};

const slotKey = (clinicianId: string, startsAt: Date) => `${clinicianId}:${startsAt.getTime()}`;

export async function findAvailableSlots(request: AvailabilityRequest, now = new Date()) {
  const [clinicians, booked] = await Promise.all([listClinicians(), listBookedSlotsSince(now)]);
  const taken = new Set(booked.map((slot) => slotKey(slot.clinicianId, slot.startsAt)));
  const times = bookableSlots(now).filter((slot) => matchesTime(slot, request));
  return times
    .flatMap((startsAt) =>
      clinicians
        .filter((clinician) => matchesClinician(clinician, request) && !taken.has(slotKey(clinician.id, startsAt)))
        .map((clinician) => ({
          clinicianId: clinician.id,
          clinicianName: clinician.name,
          specialty: clinician.specialty,
          startsAt: startsAt.toISOString(),
          label: clinicLabel(startsAt),
        })),
    )
    .slice(0, maxSlots);
}

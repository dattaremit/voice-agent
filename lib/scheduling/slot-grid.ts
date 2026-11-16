import {
  BOOKING_WINDOW_DAYS,
  CLOSING_HOUR,
  MINIMUM_NOTICE_MINUTES,
  OPENING_HOUR,
  SLOT_MINUTES,
  WORKDAYS,
} from "./clinic-hours";
import { addDays, clinicDateKey, clinicDateTime, clinicWeekday } from "./zoned-time";

const slotsPerDay = ((CLOSING_HOUR - OPENING_HOUR) * 60) / SLOT_MINUTES;

const daySlots = (dateKey: string) =>
  Array.from({ length: slotsPerDay }, (_, index) => {
    const minutes = OPENING_HOUR * 60 + index * SLOT_MINUTES;
    return clinicDateTime(dateKey, Math.floor(minutes / 60), minutes % 60);
  });

export function bookableSlots(now: Date) {
  const earliest = now.getTime() + MINIMUM_NOTICE_MINUTES * 60_000;
  const today = clinicDateKey(now);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, offset) => addDays(today, offset))
    .flatMap(daySlots)
    .filter((slot) => WORKDAYS.has(clinicWeekday(slot)) && slot.getTime() >= earliest);
}

export const isBookableSlot = (startsAt: Date, now: Date) =>
  bookableSlots(now).some((slot) => slot.getTime() === startsAt.getTime());

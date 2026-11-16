import { CLINIC_TIME_ZONE } from "@/modules/scheduling/clinic-hours";

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

const offsetFormatter = new Intl.DateTimeFormat("en-US", { timeZone: CLINIC_TIME_ZONE, timeZoneName: "longOffset" });
const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TIME_ZONE, dateStyle: "short" });
const weekdayFormatter = new Intl.DateTimeFormat("en-US", { timeZone: CLINIC_TIME_ZONE, weekday: "short" });
const hourFormatter = new Intl.DateTimeFormat("en-US", { timeZone: CLINIC_TIME_ZONE, hour: "numeric", hourCycle: "h23" });
const labelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CLINIC_TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const offsetMinutes = (instant: Date) => {
  const name = offsetFormatter.formatToParts(instant).find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
};

export const clinicDateKey = (instant: Date) => dateKeyFormatter.format(instant);

export const clinicWeekday = (instant: Date) => weekdayFormatter.format(instant);

export const clinicHour = (instant: Date) => Number(hourFormatter.format(instant));

export const clinicLabel = (instant: Date) => labelFormatter.format(instant);

export const addDays = (dateKey: string, days: number) =>
  new Date(Date.parse(`${dateKey}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);

export function clinicDateTime(dateKey: string, hour: number, minute: number) {
  const naive = Date.parse(`${dateKey}T00:00:00Z`) + (hour * 60 + minute) * MINUTE_MS;
  const firstGuess = new Date(naive - offsetMinutes(new Date(naive)) * MINUTE_MS);
  return new Date(naive - offsetMinutes(firstGuess) * MINUTE_MS);
}

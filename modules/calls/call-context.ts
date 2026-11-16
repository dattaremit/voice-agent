import { listClinicians } from "@/modules/scheduling/clinician-repository";
import { CLINIC_TIME_ZONE, CLOSING_HOUR, OPENING_HOUR, SLOT_MINUTES } from "@/modules/scheduling/clinic-hours";

const todayFormatter = new Intl.DateTimeFormat("en-US", { timeZone: CLINIC_TIME_ZONE, dateStyle: "full" });

export async function buildCallContext(callId: string, now = new Date()) {
  return {
    callId,
    today: todayFormatter.format(now),
    clinicHours: `Monday to Friday, ${OPENING_HOUR}:00 to ${CLOSING_HOUR}:00 ${CLINIC_TIME_ZONE}, ${SLOT_MINUTES} minute appointments`,
    clinicians: await listClinicians(),
  };
}

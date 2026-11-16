import { bookableSlots } from "@/modules/scheduling/slot-grid";
import type { DbExecutor } from "./client";
import { appointments, clinicians, patients } from "./schema";
import { seedBookings, seedClinicians, seedPatients } from "./seed-data";

export async function seedDatabase(executor: DbExecutor) {
  const patientRows = await executor.insert(patients).values(seedPatients).returning({ id: patients.id });
  const clinicianRows = await executor.insert(clinicians).values(seedClinicians).returning({ id: clinicians.id });
  const slots = bookableSlots(new Date());
  await executor.insert(appointments).values(
    seedBookings.map((booking) => ({
      patientId: patientRows[booking.patient].id,
      clinicianId: clinicianRows[booking.clinician].id,
      startsAt: slots[booking.slot],
      reason: booking.reason,
    })),
  );
}

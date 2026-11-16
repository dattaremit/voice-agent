import { bookableSlots } from "@/modules/scheduling/slot-grid";
import { db } from "./client";
import { appointments, calls, clinicians, patients } from "./schema";
import { seedBookings, seedClinicians, seedPatients } from "./seed-data";

await db.transaction(async (tx) => {
  await tx.delete(calls);
  await tx.delete(patients);
  await tx.delete(clinicians);
  const patientRows = await tx.insert(patients).values(seedPatients).returning({ id: patients.id });
  const clinicianRows = await tx.insert(clinicians).values(seedClinicians).returning({ id: clinicians.id });
  const slots = bookableSlots(new Date());
  await tx.insert(appointments).values(
    seedBookings.map((booking) => ({
      patientId: patientRows[booking.patient].id,
      clinicianId: clinicianRows[booking.clinician].id,
      startsAt: slots[booking.slot],
      reason: booking.reason,
    })),
  );
});

console.log(`Seeded ${seedPatients.length} patients, ${seedClinicians.length} clinicians, ${seedBookings.length} appointments`);
process.exit(0);

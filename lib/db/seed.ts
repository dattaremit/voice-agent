import { db } from "./client";
import { patients, visits } from "./schema";
import { seedPatients } from "./seed-data";

await db.transaction(async (tx) => {
  await tx.delete(patients);
  for (const { visit, ...patient } of seedPatients) {
    const [created] = await tx.insert(patients).values(patient).returning({ id: patients.id });
    await tx.insert(visits).values({ ...visit, patientId: created.id });
  }
});

console.log(`Seeded ${seedPatients.length} patients`);
process.exit(0);

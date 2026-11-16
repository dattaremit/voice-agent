import { db } from "./client";
import { calls, clinicians, patients } from "./schema";
import { seedDatabase } from "./seed-database";

await db.transaction(async (tx) => {
  await tx.delete(calls);
  await tx.delete(patients);
  await tx.delete(clinicians);
  await seedDatabase(tx);
});

console.log("Database reset with sample data");
process.exit(0);

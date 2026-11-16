import { db } from "./client";
import { clinicians } from "./schema";
import { seedDatabase } from "./seed-database";

const [existing] = await db.select({ id: clinicians.id }).from(clinicians).limit(1);
if (existing) {
  console.log("Database already has data, skipping seed");
} else {
  await db.transaction(seedDatabase);
  console.log("Seeded empty database with sample data");
}
process.exit(0);

import { defineConfig } from "drizzle-kit";
import { env } from "./lib/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: env.DATABASE_URL },
});

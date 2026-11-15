import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

const sql = globalForDb.sql ?? postgres(env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

export const db = drizzle(sql, { schema, casing: "snake_case" });

export type DbExecutor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

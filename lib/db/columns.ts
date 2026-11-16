import { type AnyPgColumn, timestamp, uuid } from "drizzle-orm/pg-core";

export const id = () => uuid().primaryKey().defaultRandom();

export const createdAt = () => timestamp({ withTimezone: true }).defaultNow().notNull();

export const timestampColumn = () => timestamp({ withTimezone: true });

export const reference = (target: () => AnyPgColumn) =>
  uuid().notNull().references(target, { onDelete: "cascade" });

export const optionalReference = (target: () => AnyPgColumn) => uuid().references(target, { onDelete: "set null" });

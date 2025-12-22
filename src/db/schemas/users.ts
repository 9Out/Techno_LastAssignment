/* eslint-disable @typescript-eslint/no-unused-vars */
// schema.ts
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

// table users
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  fullName: varchar("full_name", { length: 150 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  active: boolean("active").notNull().default(true),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull().default("0"),
  budgetNow: decimal("budget_now", { precision: 10, scale: 2 }).notNull().default("0"),
  lastUpdateBudget: timestamp("last_update_budget"),

  // Logging fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: varchar("created_by").default("system"),

  updatedAt: timestamp("updated_at"),
  updatedBy: varchar("updated_by").default("system"),

  deletedAt: timestamp("deleted_at"),
  deletedBy: varchar("deleted_by").default("system"),
});
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
  uuid,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// =============================
// TABEL expense_categories
// =============================
export const expenseCategories = pgTable(
  "expense_categories",
  {
    id: uuid("id").primaryKey(),
    code: varchar("code", { length: 50 }).notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),

    updatedAt: timestamp("updated_at"),
    updatedBy: uuid("updated_by")
      .references(() => users.id),

    deletedAt: timestamp("deleted_at"),
    deletedBy: uuid("deleted_by")
      .references(() => users.id),
  },
);
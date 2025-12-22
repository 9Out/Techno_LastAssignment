/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  pgTable,
  text,
  timestamp,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { uuid } from "drizzle-orm/pg-core";
import { incomeCategories } from "./income-categories.scheme";

// =============================
// TABEL income_batches
// =============================
export const incomeBatches = pgTable("income_batches", {
  id: uuid("id").primaryKey(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => incomeCategories.id),

  incomeDate: date("income_date").notNull(),

  totalAmount: decimal("total_amount", { precision: 15, scale: 2 })
    .notNull()
    .default("0"),

  description: text("description"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by")
    .references(() => users.id).notNull(),

  updatedAt: timestamp("updated_at"),
  updatedBy: uuid("updated_by")
    .references(() => users.id),

  deletedAt: timestamp("deleted_at"),
  deletedBy: uuid("deleted_by")
    .references(() => users.id),
});

export { incomeCategories };
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { uuid } from "drizzle-orm/pg-core";

// =============================
// TABEL income_categories
// =============================
export const incomeCategories = pgTable("income_categories", {
  id: uuid("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 150 }).notNull(),
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

// run ini di sql editor, tujuannya
// agar data yang belum dihapus (delete_by is NULL)
// unik. Karena kalau langsung unik, terdapat
// anomali jika melakukan update dengan code yang sama
// dengan data yang telah terhapus
// CREATE UNIQUE INDEX unique_code_active
// ON income_categories (code)
// WHERE deleted_at IS NULL;
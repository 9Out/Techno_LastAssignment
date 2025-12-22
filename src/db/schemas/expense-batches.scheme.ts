/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  pgTable,
  text,
  timestamp,
  decimal,
  date,
  varchar, // Menambahkan varchar untuk kolom seperti ref_no, vendor_name
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { uuid } from "drizzle-orm/pg-core";
import { expenseCategories } from "./expense-categories.scheme"; // Asumsi ada skema untuk kategori pengeluaran
// import { accounts } from "./accounts.scheme"; // Jika account_id diperlukan di masa depan

// =============================
// TABEL expense_batches
// =============================
export const expenseBatches = pgTable("expense_batches", {
  // Field-field dari tabel pengeluaran sekolah
  id: uuid("id").primaryKey(), // Primary key pengeluaran

  // category_id tidak berwarna merah, dibuat notNull dan mereferensikan expenseCategories
  categoryId: uuid("category_id")
    .notNull()
    .references(() => expenseCategories.id), // Kategori pengeluaran.


  // expense_date dibuat notNull karena penting untuk batch pengeluaran
  expenseDate: date("expense_date").notNull(),

  // amount (Menggunakan totalAmount untuk batch)
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 })
    .notNull()
    .default("0"), // Nominal total pengeluaran.

  description: text("description"), // Deskripsi pengeluaran.

  // Field Auditing
  createdAt: timestamp("created_at").notNull().defaultNow(), // Waktu record dibuat
  createdBy: uuid("created_by") // ID User yang membuat record.
    .references(() => users.id)
    .notNull(),

  updatedAt: timestamp("updated_at"), // Waktu record diperbarui
  updatedBy: uuid("updated_by") // ID User yang memperbarui record.
    .references(() => users.id),

  deletedAt: timestamp("deleted_at"), // Waktu record dihapus
  deletedBy: uuid("deleted_by") // ID User yang menghapus record.
    .references(() => users.id),
});

export { expenseCategories };
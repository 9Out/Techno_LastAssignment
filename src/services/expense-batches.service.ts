import { and, asc, desc, eq, gte, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../db/drizzleClient";

import {
  IExpenseBatchQuery,
  ICreateExpenseBatchRequest,
  IUpdateExpenseBatchRequest,
  ISoftDeleteExpenseBatchRequest,
} from "../types/requests/expense-batches-request";

import { expenseBatches, expenseCategories } from "../db/schemas/expense-batches.scheme";
import { paginate } from "../utils/paginate.util";

import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";

export class ExpenseBatchesService {
  // FIND ALL
  async findAll(query: IExpenseBatchQuery = {}, userId: string) {
    const action = "FETCH EXPENSE BATCHES";

    try {
      const { search, categoryId, fromDate, toDate, sortBy, sortOrder } = query;
      const page = query.page && query.page > 0 ? query.page : 1;
      const perPage = query.perPage && query.perPage > 0 ? query.perPage : 10;

      const createdBy = userId;

      // 1. Inisialisasi Kondisi Awal
      const conditions = [isNull(expenseBatches.deletedAt)];

      // 2. Filter 'search' (Diperbaiki: Mencakup description ATAU vendorName)
      if (typeof search === "string" && search.trim().length > 0) {
        const keyword = search.trim().toLowerCase();

        const searchCondition = or(
          sql`lower(${expenseBatches.description}) like ${`%${keyword}%`}`,
        );

        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // 3. Filter berdasarkan Kategori
      if (categoryId) conditions.push(eq(expenseBatches.categoryId, categoryId));

      // 4. Filter berdasarkan Rentang Waktu (Disarankan menggunakan expenseDate)
      // Jika Anda ingin tetap menggunakan createdAt, ganti expenseBatches.expenseDate
      // menjadi expenseBatches.createdAt
      if (fromDate) conditions.push(gte(expenseBatches.expenseDate, fromDate.toISOString()));
      if (toDate) conditions.push(lte(expenseBatches.expenseDate, toDate.toISOString()));

      if (createdBy) conditions.push(eq(expenseCategories.createdBy, createdBy));

      // --- PENGHITUNGAN TOTAL ITEM ---
      const totalQuery = await db
        .select({ count: sql<number>`count(*)` })
        .from(expenseBatches)
        .where(and(...conditions));

      const [{ count: totalItems }] = totalQuery;
      const offset = (page - 1) * perPage;

      let orderClause;
      const sort = sortOrder === "desc" ? desc : asc;

      // 5. Menentukan Urutan Berdasarkan Kolom (Disempurnakan)
      switch (sortBy) {
        case "createdAt":
          orderClause = sort(expenseBatches.createdAt);
          break;
        case "totalAmount":
          orderClause = sort(expenseBatches.totalAmount);
          break;
        case "expenseDate": // Tambahkan sorting berdasarkan expenseDate
          orderClause = sort(expenseBatches.expenseDate);
          break;
        default:
          // Default sorting jika sortBy tidak disediakan atau tidak valid
          orderClause = desc(expenseBatches.createdAt); 
          break;
      }

      // Query utama untuk mengambil data batch pengeluaran
      const queryBuilder = db
      .select()
      .from(expenseBatches)
      .where(and(...conditions))
      .limit(perPage)
      .offset(offset)
      .orderBy(orderClause); // Memindahkan orderBy ke sini agar selalu ada

      const data = await queryBuilder;
      const result = paginate(data, Number(totalItems), page, perPage);

      logSuccess(action);
      return result;

    } catch (err) {
      logError(action, err);
      throw new AppError("EXPENSE_BATCH_FETCH_FAILED", "Failed to fetch expense batches.", 500);
    }
  }

  // FIND BY ID
  async findById(id: string) {
    const action = "FETCH EXPENSE BATCH BY ID";

    try {
      const result = await db
        .select()
        .from(expenseBatches)
        .where(and(eq(expenseBatches.id, id), isNull(expenseBatches.deletedAt)));

      if (!result.length) {
        throw new AppError("EXPENSE_BATCH_NOT_FOUND", "Expense batch not found.", 404);
      }

      logSuccess(action, result[0]);
      return result[0];

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("EXPENSE_BATCH_FETCH_FAILED", "Failed to fetch expense batch.", 500);
    }
  }

  // CREATE
  async create(data: ICreateExpenseBatchRequest) {
    const action = "CREATE EXPENSE BATCH";

    try {
      const id = crypto.randomUUID();

      // ✅ check duplicate id (optional tapi konsisten)
      const existingId = await db
        .select()
        .from(expenseBatches)
        .where(eq(expenseBatches.id, id));

      if (existingId.length > 0) {
        throw new AppError(
          "EXPENSE_BATCH_ID_DUPLICATE",
          "Expense batch ID already exists.",
          400
        );
      }

      // ✅ pastikan category masih aktif
      const categoryExists = await db
        .select()
        .from(expenseCategories)
        .where(
          and(
            eq(expenseCategories.id, data.categoryId),
            isNull(expenseCategories.deletedAt)
          )
        );

      if (categoryExists.length === 0) {
        throw new AppError(
          "EXPENSE_CATEGORY_NOT_FOUND",
          "Expense category not found or deleted.",
          404
        );
      }

      // ✅ insert
      const [inserted] = await db
        .insert(expenseBatches)
        .values({
          ...data,
          id,
          createdBy: data.createdBy,
          createdAt: new Date(),
        })
        .returning();

      if (!inserted) {
        throw new AppError(
          "EXPENSE_BATCH_CREATE_FAILED",
          "Failed to create expense batch.",
          500
        );
      }

      logSuccess(action, inserted);
      return inserted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "EXPENSE_BATCH_CREATE_FAILED",
        "Failed to create expense batch.",
        500
      );
    }
  }

  // UPDATE
  async update(id: string, data: IUpdateExpenseBatchRequest) {
    const action = "UPDATE EXPENSE BATCH";

    try {
      const [updated] = await db
        .update(expenseBatches)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(expenseBatches.id, id))
        .returning();

      if (!updated) {
        throw new AppError("EXPENSE_BATCH_NOT_FOUND", "Expense batch not found.", 404);
      }

      logSuccess(action, updated);
      return updated;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("EXPENSE_BATCH_UPDATE_FAILED", "Failed to update expense batch.", 500);
    }
  }

  // SOFT DELETE
  async softDelete(id: string, payload: ISoftDeleteExpenseBatchRequest) {
    const action = "DELETE EXPENSE BATCH";

    try {
      const [deleted] = await db
        .update(expenseBatches)
        .set({
          deletedAt: new Date(),
          deletedBy: payload.userId,
        })
        .where(eq(expenseBatches.id, id))
        .returning();

      if (!deleted) {
        throw new AppError("EXPENSE_BATCH_NOT_FOUND", "Expense batch not found.", 404);
      }

      logSuccess(action, deleted);
      return deleted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("EXPENSE_BATCH_DELETE_FAILED", "Failed to delete expense batch.", 500);
    }
  }

}

export const expenseBatchesService = new ExpenseBatchesService();
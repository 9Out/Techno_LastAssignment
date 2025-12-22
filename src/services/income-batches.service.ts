import { and, asc, desc, eq, gte, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../db/drizzleClient";

import {
  IIncomeBatchQuery,
  ICreateIncomeBatchRequest,
  IUpdateIncomeBatchRequest,
  ISoftDeleteIncomeBatchRequest,
} from "../types/requests/income-batches-request";

// Sesuaikan path import schema ini dengan struktur project Anda
import { incomeBatches, incomeCategories } from "../db/schemas/income-batches.scheme";
import { paginate } from "../utils/paginate.util";

import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";

export class IncomeBatchesService {

  // FIND ALL
  async findAll(query: IIncomeBatchQuery = {}, userId: string) {
    const action = "FETCH INCOME BATCHES";

    try {
      const { search, categoryId, fromDate, toDate, sortBy, sortOrder } = query;
      const page = query.page && query.page > 0 ? query.page : 1;
      const perPage = query.perPage && query.perPage > 0 ? query.perPage : 10;

      const createdBy = userId

      // 1. Inisialisasi Kondisi Awal
      const conditions = [isNull(incomeBatches.deletedAt)];

      // 2. Filter 'search' (Description)
      if (typeof search === "string" && search.trim().length > 0) {
        const keyword = search.trim().toLowerCase();

        const searchCondition = or(
          sql`lower(${incomeBatches.description}) like ${`%${keyword}%`}`
        );

        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // 3. Filter berdasarkan Kategori
      if (categoryId) conditions.push(eq(incomeBatches.categoryId, categoryId));

      // 4. Filter berdasarkan Rentang Waktu
      // LOGIC FIX: Menggunakan 'incomeDate' sesuai schema, bukan periodFrom/To
      // User meminta data DARI tanggal X (fromDate) SAMPAI tanggal Y (toDate)
      // Maka kita filter kolom incomeDate di antara rentang tersebut.
      if (fromDate) conditions.push(gte(incomeBatches.incomeDate, fromDate.toISOString()));
      if (toDate) conditions.push(lte(incomeBatches.incomeDate, toDate.toISOString()));

      if (createdBy) conditions.push(eq(incomeCategories.createdBy, createdBy))

      // --- PENGHITUNGAN TOTAL ITEM ---
      const totalQuery = await db
        .select({ count: sql<number>`count(*)` })
        .from(incomeBatches)
        .where(and(...conditions));

      const [{ count: totalItems }] = totalQuery;
      const offset = (page - 1) * perPage;

      let orderClause;
      const sort = sortOrder === "desc" ? desc : asc;

      // 5. Menentukan Urutan Berdasarkan Kolom
      switch (sortBy) {
        case "createdAt":
          orderClause = sort(incomeBatches.createdAt);
          break;
        case "totalAmount":
          orderClause = sort(incomeBatches.totalAmount);
          break;
        case "incomeDate": // LOGIC FIX: Sorting berdasarkan incomeDate
          orderClause = sort(incomeBatches.incomeDate);
          break;
        default:
          // Default sorting descending by createdAt
          orderClause = desc(incomeBatches.createdAt);
          break;
      }

      // Query utama
      const queryBuilder = db
        .select()
        .from(incomeBatches)
        .where(and(...conditions))
        .limit(perPage)
        .offset(offset)
        .orderBy(orderClause);

      const data = await queryBuilder;
      const result = paginate(data, Number(totalItems), page, perPage);

      logSuccess(action);
      return result;

    } catch (err) {
      logError(action, err);
      throw new AppError("INCOME_BATCH_FETCH_FAILED", "Failed to fetch income batches.", 500);
    }
  }

  // FIND BY ID
  async findById(id: string) {
    const action = "FETCH INCOME BATCH BY ID";

    try {
      const result = await db
        .select()
        .from(incomeBatches)
        .where(and(eq(incomeBatches.id, id), isNull(incomeBatches.deletedAt)));

      if (!result.length) {
        throw new AppError("INCOME_BATCH_NOT_FOUND", "Income batch not found.", 404);
      }

      logSuccess(action, result[0]);
      return result[0];

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("INCOME_BATCH_FETCH_FAILED", "Failed to fetch income batch.", 500);
    }
  }

  // CREATE
  async create(data: ICreateIncomeBatchRequest) {
    const action = "CREATE INCOME BATCH";

    try {
      const id = crypto.randomUUID();

      // ✅ check duplicate id
      const existingId = await db
        .select()
        .from(incomeBatches)
        .where(eq(incomeBatches.id, id));

      if (existingId.length > 0) {
        throw new AppError(
          "INCOME_BATCH_ID_DUPLICATE",
          "Income batch ID already exists.",
          400
        );
      }

      // ✅ pastikan category masih aktif
      const categoryExists = await db
        .select()
        .from(incomeCategories)
        .where(
          and(
            eq(incomeCategories.id, data.categoryId),
            isNull(incomeCategories.deletedAt)
          )
        );

      if (categoryExists.length === 0) {
        throw new AppError(
          "INCOME_CATEGORY_NOT_FOUND",
          "Income category not found or deleted.",
          404
        );
      }

      // ✅ insert
      const [inserted] = await db
        .insert(incomeBatches)
        .values({
          ...data,
          id,
          // createdBy diambil dari payload data (pastikan request body mengirimnya atau di-inject di controller)
          createdBy: data.createdBy, 
          createdAt: new Date(),
        })
        .returning();

      if (!inserted) {
        throw new AppError(
          "INCOME_BATCH_CREATE_FAILED",
          "Failed to create income batch.",
          500
        );
      }

      logSuccess(action, inserted);
      return inserted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "INCOME_BATCH_CREATE_FAILED",
        "Failed to create income batch.",
        500
      );
    }
  }

  // UPDATE
  async update(id: string, data: IUpdateIncomeBatchRequest) {
    const action = "UPDATE INCOME BATCH";

    try {
      const [updated] = await db
        .update(incomeBatches)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(incomeBatches.id, id))
        .returning();

      if (!updated) {
        throw new AppError("INCOME_BATCH_NOT_FOUND", "Income batch not found.", 404);
      }

      logSuccess(action, updated);
      return updated;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("INCOME_BATCH_UPDATE_FAILED", "Failed to update income batch.", 500);
    }
  }

  // SOFT DELETE
  async softDelete(id: string, payload: ISoftDeleteIncomeBatchRequest) {
    const action = "DELETE INCOME BATCH";

    try {
      const [deleted] = await db
        .update(incomeBatches)
        .set({
          deletedAt: new Date(),
          deletedBy: payload.userId,
        })
        .where(eq(incomeBatches.id, id))
        .returning();

      if (!deleted) {
        throw new AppError("INCOME_BATCH_NOT_FOUND", "Income batch not found.", 404);
      }

      logSuccess(action, deleted);
      return deleted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("INCOME_BATCH_DELETE_FAILED", "Failed to delete income batch.", 500);
    }
  }
}

export const incomeBatchesService = new IncomeBatchesService();
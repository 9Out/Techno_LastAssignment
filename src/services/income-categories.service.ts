import { and, asc, desc, eq, gte, ilike, isNull, lte, sql } from "drizzle-orm";
import { db } from "../db/drizzleClient";

import {
  ICreateIncomeCategoryRequest,
  IUpdateIncomeCategoryRequest,
  ISoftDeleteIncomeCategoryRequest,
  IIncomeCategoryQuery,
} from "../types/requests/income-categories-request";

import { incomeCategories } from "../db/schemas/income-categories.scheme";
import { paginate } from "../utils/paginate.util";

import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";
import { generateCategoryCodeFromName } from "../utils/util";

export class IncomeCategoriesService {

  // =====================================================
  // FIND ALL
  // =====================================================
  async findAll(query: IIncomeCategoryQuery = {}, userId: string) {
    const action = "FETCH INCOME CATEGORIES";

    try {
      const {
        search,
        code,
        fromDate,
        toDate,
        sortBy,
        sortOrder,
        page: rawPage,
        perPage: rawPerPage,
      } = query;

      const createdBy = userId;

      const page = rawPage && rawPage > 0 ? rawPage : 1;
      const perPage = rawPerPage && rawPerPage > 0 ? rawPerPage : 10;

      const conditions = [isNull(incomeCategories.deletedAt)];

      if (search){
        const keyword = search.trim().toLowerCase();
        conditions.push(sql`lower(${incomeCategories.name}) like ${`%${keyword}%`}`);
      } 
      if (code) conditions.push(eq(incomeCategories.code, code));
      if (createdBy) conditions.push(eq(incomeCategories.createdBy, createdBy));
      if (fromDate) conditions.push(gte(incomeCategories.createdAt, fromDate));
      if (toDate) conditions.push(lte(incomeCategories.createdAt, toDate));

      let orderClause;
      if (sortBy) {
        orderClause =
          sortOrder === "desc"
            ? desc(incomeCategories[sortBy])
            : asc(incomeCategories[sortBy]);
      }

      const totalItemsQuery = await db
        .select({ count: sql<number>`count(*)` })
        .from(incomeCategories)
        .where(and(...conditions));

      const totalItems = totalItemsQuery[0]?.count ?? 0;

      const offset = (page - 1) * perPage;

      const queryBuilder = db
        .select()
        .from(incomeCategories)
        .where(and(...conditions))
        .limit(perPage)
        .offset(offset);

      if (orderClause) queryBuilder.orderBy(orderClause);

      const data = await queryBuilder;

      const result = paginate(data, Number(totalItems), page, perPage);

      logSuccess(action);
      return result;

    } catch (err) {
      logError(action, err);
      throw new AppError(
        "INCOME_CATEGORY_FETCH_FAILED",
        "Failed to fetch income categories.",
        500
      );
    }
  }

  // =====================================================
  // FIND BY ID
  // =====================================================
  async findById(id: string) {
    const action = "FETCH INCOME CATEGORY BY ID";

    try {
      const result = await db
        .select()
        .from(incomeCategories)
        .where(and(eq(incomeCategories.id, id), isNull(incomeCategories.deletedAt)));

      if (!result[0]) {
        throw new AppError(
          "INCOME_CATEGORY_NOT_FOUND",
          "Income category not found.",
          404
        );
      }

      logSuccess(action, result[0]);
      return result[0];

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "INCOME_CATEGORY_FETCH_FAILED",
        "Failed to fetch income category.",
        500
      );
    }
  }

  // =====================================================
  // CREATE
  // =====================================================
  async create(data: ICreateIncomeCategoryRequest) {
    const action = "CREATE INCOME CATEGORY";

    try {
      const id = crypto.randomUUID();
      // check duplicate ID
      const existingId = await db
        .select()
        .from(incomeCategories)
        .where(eq(incomeCategories.id, id));

      if (existingId.length > 0) {
        throw new AppError(
          "INCOME_CATEGORY_ID_DUPLICATE",
          "Category ID is already in use.",
          400
        );
      }

      const code = generateCategoryCodeFromName(data.name);

      // check duplicate code
      const existingCode = await db
        .select()
        .from(incomeCategories)
        .where(and(
          eq(incomeCategories.createdBy, data.createdBy),
          eq(incomeCategories.code, code),
          isNull(incomeCategories.deletedAt)
        ));
      

      if (existingCode.length > 0) {
        throw new AppError(
          "INCOME_CATEGORY_CODE_DUPLICATE",
          "Category code is already in use.",
          400
        );
      }

       // insert ke DB
      const [inserted] = await db
        .insert(incomeCategories)
        .values({
          id,
          code,
          name: data.name,
          createdBy: data.createdBy,
          createdAt: new Date(),
        })
        .returning();

      if (!inserted) {
        throw new AppError(
          "INCOME_CATEGORY_CREATE_FAILED",
          "Failed to create income category.",
          500
        );
      }

      logSuccess(action, inserted);
      return inserted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "INCOME_CATEGORY_CREATE_FAILED",
        "Failed to create income category.",
        500
      );
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================
  async update(id: string, data: IUpdateIncomeCategoryRequest) {
    const action = "UPDATE INCOME CATEGORY";

    try {
      const existing = await this.findById(id);

      // siapkan payload update
      const updatePayload: Partial<typeof incomeCategories.$inferInsert> = {
        updatedAt: new Date(),
        updatedBy: data.updatedBy,
      };

      // jika name berubah → regenerate code
      if (data.name && data.name !== existing.name) {
        const newCode = generateCategoryCodeFromName(data.name);

        // cek duplicate code
        const existingCode = await db
          .select()
          .from(incomeCategories)
          .where(
            and(
              eq(incomeCategories.createdBy, existing.createdBy),
              eq(incomeCategories.code, newCode),
              isNull(incomeCategories.deletedAt)
            )
          );

        if (existingCode.length > 0 && existingCode[0].id !== id) {
          throw new AppError(
            "INCOME_CATEGORY_CODE_DUPLICATE",
            "Category code is already in use.",
            400
          );
        }

        updatePayload.code = newCode;
        updatePayload.name = data.name;
      }

      // update description bila ada
      if (data.description !== undefined) {
        updatePayload.description = data.description;
      }

      const [updated] = await db
        .update(incomeCategories)
        .set(updatePayload)
        .where(eq(incomeCategories.id, id))
        .returning();

      if (!updated) {
        throw new AppError(
          "INCOME_CATEGORY_NOT_FOUND",
          "Income category not found.",
          404
        );
      }

      logSuccess(action, updated);
      return updated;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "INCOME_CATEGORY_UPDATE_FAILED",
        "Failed to update income category.",
        500
      );
    }
  }


  // =====================================================
  // SOFT DELETE
  // =====================================================
  async softDelete(id: string, payload: ISoftDeleteIncomeCategoryRequest) {
    const action = "DELETE INCOME CATEGORY";

    try {
      await this.findById(id);

      const [deleted] = await db
        .update(incomeCategories)
        .set({
          deletedAt: new Date(),
          deletedBy: payload.userId,
        })
        .where(eq(incomeCategories.id, id))
        .returning();

      if (!deleted) {
        throw new AppError(
          "INCOME_CATEGORY_NOT_FOUND",
          "Income category not found.",
          404
        );
      }

      logSuccess(action, deleted);
      return deleted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "INCOME_CATEGORY_DELETE_FAILED",
        "Failed to delete income category.",
        500
      );
    }
  }
}

export const incomeCategoriesService = new IncomeCategoriesService();
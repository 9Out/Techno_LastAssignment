import { and, asc, desc, eq, gte, ilike, isNull, lte, sql } from "drizzle-orm";
import { db } from "../db/drizzleClient";

import {
  ICreateExpenseCategoryRequest,
  IUpdateExpenseCategoryRequest,
  ISoftDeleteExpenseCategoryRequest,
  IExpenseCategoryQuery,
} from "../types/requests/expense-categories-request";

import { expenseCategories } from "../db/schemas/expense-categories.scheme";
import { paginate } from "../utils/paginate.util";

import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";
import { generateCategoryCodeFromName } from "../utils/util";

export class ExpenseCategoriesService {

  // =====================================================
  // FIND ALL
  // =====================================================
  async findAll(query: IExpenseCategoryQuery = {}, userId: string) {
    const action = "FETCH EXPENSE CATEGORIES";

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

      const conditions = [isNull(expenseCategories.deletedAt)];

      if (search) {
        const keyword = search.trim().toLowerCase();
        conditions.push(sql`lower(${expenseCategories.name}) like ${`%${keyword}%`}`);
      }
      if (code) {
        conditions.push(eq(expenseCategories.code, code));
      }
      if (createdBy) {
        conditions.push(eq(expenseCategories.createdBy, createdBy));
      }
      if (fromDate) {
        conditions.push(gte(expenseCategories.createdAt, fromDate));
      }
      if (toDate) {
        conditions.push(lte(expenseCategories.createdAt, toDate));
      }

      let orderClause;
      if (sortBy) {
        orderClause =
          sortOrder === "desc"
            ? desc(expenseCategories[sortBy])
            : asc(expenseCategories[sortBy]);
      }

      const totalItemsQuery = await db
        .select({ count: sql<number>`count(*)` })
        .from(expenseCategories)
        .where(and(...conditions));

      const totalItems = totalItemsQuery[0]?.count ?? 0;
      const offset = (page - 1) * perPage;

      const queryBuilder = db
        .select()
        .from(expenseCategories)
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
        "EXPENSE_CATEGORY_FETCH_FAILED",
        "Failed to fetch expense categories.",
        500
      );
    }
  }

  // =====================================================
  // FIND BY ID
  // =====================================================
  async findById(id: string) {
    const action = "FETCH EXPENSE CATEGORY BY ID";

    try {
      const result = await db
        .select()
        .from(expenseCategories)
        .where(
          and(
            eq(expenseCategories.id, id),
            isNull(expenseCategories.deletedAt)
          )
        );

      if (!result[0]) {
        throw new AppError(
          "EXPENSE_CATEGORY_NOT_FOUND",
          "Expense category not found.",
          404
        );
      }

      logSuccess(action, result[0]);
      return result[0];

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "EXPENSE_CATEGORY_FETCH_FAILED",
        "Failed to fetch expense category.",
        500
      );
    }
  }

  // =====================================================
  // CREATE
  // =====================================================
  async create(data: ICreateExpenseCategoryRequest) {
    const action = "CREATE EXPENSE CATEGORY";

    try {
      const id = crypto.randomUUID();
      const code = generateCategoryCodeFromName(data.name);

      // cek duplicate code
      const existingCode = await db
        .select()
        .from(expenseCategories)
        .where(
          and(
            eq(expenseCategories.createdBy, data.createdBy),
            eq(expenseCategories.code, code),
            isNull(expenseCategories.deletedAt)
          )
        );

      if (existingCode.length > 0) {
        throw new AppError(
          "EXPENSE_CATEGORY_CODE_DUPLICATE",
          "Category code is already in use.",
          400
        );
      }

      // ----------------------------------
      // 2. Insert category baru
      // ----------------------------------
      const [inserted] = await db
        .insert(expenseCategories)
        .values({
          id,
          code,
          name: data.name,
          description: data.description,
          createdBy: data.createdBy,
          createdAt: new Date(),
        })
        .returning();

      if (!inserted) {
        throw new AppError(
          "EXPENSE_CATEGORY_CREATE_FAILED",
          "Failed to create expense category.",
          500
        );
      }

      logSuccess(action, inserted);
      return inserted;
    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "EXPENSE_CATEGORY_CREATE_FAILED",
        "Failed to create expense category.",
        500
      );
    }
  }


  // =====================================================
  // UPDATE
  // =====================================================
  async update(id: string, data: IUpdateExpenseCategoryRequest) {
    const action = "UPDATE EXPENSE CATEGORY";

    try {
      const existing = await this.findById(id);

      let newCode = existing.code;
      let codeChanged = false;

      const updatePayload: Partial<typeof expenseCategories.$inferInsert> = {
        updatedAt: new Date(),
        updatedBy: data.updatedBy,
      };

      // ---------------------------------------
      // 0. Description (WAJIB DIHANDLE TERPISAH)
      // ---------------------------------------
      if (data.description !== undefined && data.description !== existing.description) {
        updatePayload.description = data.description;
      }

      // ---------------------------------------
      // 1. Jika name berubah → code berubah
      // ---------------------------------------
      if (data.name !== undefined && data.name !== existing.name) {
        newCode = generateCategoryCodeFromName(data.name);
        codeChanged = true;

        const existingCodeCheck = await db
          .select()
          .from(expenseCategories)
          .where(
            and(
              eq(expenseCategories.createdBy, existing.createdBy),
              eq(expenseCategories.code, newCode),
              isNull(expenseCategories.deletedAt)
            )
          );

        if (existingCodeCheck.length > 0 && existingCodeCheck[0].id !== id) {
          throw new AppError(
            "EXPENSE_CATEGORY_CODE_DUPLICATE",
            "Category code is already in use.",
            400
          );
        }

        updatePayload.name = data.name;
        updatePayload.code = newCode;
      }

      // ---------------------------------------
      // 4. Update kategori utama
      // ---------------------------------------
      const [updated] = await db
        .update(expenseCategories)
        .set(updatePayload)
        .where(eq(expenseCategories.id, id))
        .returning();

      if (!updated) {
        throw new AppError(
          "EXPENSE_CATEGORY_NOT_FOUND",
          "Expense category not found.",
          404
        );
      }

      logSuccess(action, updated);
      return updated;

    } catch (err) {
      logError(action, err);

      if (err instanceof AppError) throw err;

      throw new AppError(
        "EXPENSE_CATEGORY_UPDATE_FAILED",
        "Failed to update expense category.",
        500
      );
    }
  }


  // =====================================================
  // SOFT DELETE
  // =====================================================
  async softDelete(
    id: string,
    payload: ISoftDeleteExpenseCategoryRequest
  ) {
    const action = "DELETE EXPENSE CATEGORY";

    try {
      await this.findById(id);

      const [deleted] = await db
        .update(expenseCategories)
        .set({
          deletedAt: new Date(),
          deletedBy: payload.userId,
        })
        .where(eq(expenseCategories.id, id))
        .returning();

      if (!deleted) {
        throw new AppError(
          "EXPENSE_CATEGORY_NOT_FOUND",
          "Expense category not found.",
          404
        );
      }

      logSuccess(action, deleted);
      return deleted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;

      throw new AppError(
        "EXPENSE_CATEGORY_DELETE_FAILED",
        "Failed to delete expense category.",
        500
      );
    }
  }

}

export const expenseCategoriesService = new ExpenseCategoriesService();
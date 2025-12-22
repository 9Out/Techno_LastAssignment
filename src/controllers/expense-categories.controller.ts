import { expenseCategoriesService } from "../services/expense-categories.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  IExpenseCategoryQuery,
  ICreateExpenseCategoryRequest,
  IUpdateExpenseCategoryRequest,
  ISoftDeleteExpenseCategoryRequest,
} from "../types/requests/expense-categories-request.d";

import { successResponse, errorResponse } from "../utils/response.util";
import { logSuccess, logError } from "../utils/logger.util";
import { AppError } from "../errors/app.error";

export class ExpenseCategoriesController {

  // =====================================================
  // GET ALL
  // =====================================================
  async getAll(request: Request, h: ResponseToolkit) {
    const action = "GET_ALL_EXPENSE_CATEGORIES";

    try {
      const query: IExpenseCategoryQuery = request.query as any;
      const userId = request.auth.credentials?.id as string;
      const result = await expenseCategoriesService.findAll(query, userId);

      logSuccess(action, result);
      return successResponse(
        h,
        result.data,  
        "Income categories retrieved successfully",
        200,
        result.meta 
      );
     
    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  async getById(request: Request, h: ResponseToolkit) {
    const action = "GET_EXPENSE_CATEGORY_BY_ID";

    try {
      const { id } = request.params;
      const result = await expenseCategoriesService.findById(id);

      logSuccess(action, result);
      return successResponse(
        h,
        result,
        "Expense category retrieved successfully"
      );

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // =====================================================
  // CREATE
  // =====================================================
  async create(request: Request, h: ResponseToolkit) {
    const action = "CREATE_EXPENSE_CATEGORY";

    try {
      const payload = request.payload as ICreateExpenseCategoryRequest;

      const data: ICreateExpenseCategoryRequest = {
        ...payload,
        createdBy: request.auth.credentials?.id as string,
      };

      const result = await expenseCategoriesService.create(data);

      logSuccess(action, result);
      return successResponse(
        h,
        result,
        "Expense category created successfully",
        201
      );

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================
  async update(request: Request, h: ResponseToolkit) {
    const action = "UPDATE_EXPENSE_CATEGORY";

    try {
      const { id } = request.params;
      const payload = request.payload as IUpdateExpenseCategoryRequest;

      const data: IUpdateExpenseCategoryRequest = {
        ...payload,
        updatedBy: request.auth.credentials?.id as string,
      };

      const result = await expenseCategoriesService.update(id, data);

      logSuccess(action, result);
      return successResponse(
        h,
        result,
        "Expense category updated successfully"
      );

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // =====================================================
  // DELETE (SOFT)
  // =====================================================
  async delete(request: Request, h: ResponseToolkit) {
    const action = "DELETE_EXPENSE_CATEGORY";

    try {
      const { id } = request.params;

      const payload: ISoftDeleteExpenseCategoryRequest = {
        userId: request.auth.credentials?.id as string,
      };

      const result = await expenseCategoriesService.softDelete(id, payload);

      logSuccess(action, result);
      return successResponse(
        h,
        result,
        "Expense category deleted successfully"
      );

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }
}

export const expenseCategoriesController =
  new ExpenseCategoriesController();
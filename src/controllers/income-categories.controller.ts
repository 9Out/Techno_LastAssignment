import { incomeCategoriesService } from "../services/income-categories.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IIncomeCategoryQuery,
  ICreateIncomeCategoryRequest,
  IUpdateIncomeCategoryRequest,
  ISoftDeleteIncomeCategoryRequest,
} from "../types/requests/income-categories-request.d";

import { successResponse, errorResponse } from "../utils/response.util";
import { logSuccess, logError } from "../utils/logger.util";
import { AppError } from "../errors/app.error";

export class IncomeCategoriesController {

  // GET ALL
  async getAll(request: Request, h: ResponseToolkit) {
    const action = "GET_ALL_INCOME_CATEGORIES";

    try {
      const query: IIncomeCategoryQuery = request.query as any;
      const userId = request.auth.credentials?.id as string;
      const result = await incomeCategoriesService.findAll(query, userId);

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

  // GET BY ID
  async getById(request: Request, h: ResponseToolkit) {
    const action = "GET_INCOME_CATEGORY_BY_ID";

    try {
      const { id } = request.params;
      const result = await incomeCategoriesService.findById(id);

      logSuccess(action, result);
      return successResponse(h, result, "Income category retrieved successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // CREATE
  async create(request: Request, h: ResponseToolkit) {
    const action = "CREATE_INCOME_CATEGORY";

    try {
      const payload = request.payload as ICreateIncomeCategoryRequest;

      const data: ICreateIncomeCategoryRequest = {
        ...payload,
        createdBy: request.auth.credentials?.id as string,
      };

      const result = await incomeCategoriesService.create(data);

      logSuccess(action, result);
      return successResponse(h, result, "Income category created successfully", 201);

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // UPDATE
  async update(request: Request, h: ResponseToolkit) {
    const action = "UPDATE_INCOME_CATEGORY";

    try {
      const { id } = request.params;
      const payload = request.payload as IUpdateIncomeCategoryRequest;

      const data: IUpdateIncomeCategoryRequest = {
        ...payload,
        updatedBy: request.auth.credentials?.id as string,
      };

      const result = await incomeCategoriesService.update(id, data);

      logSuccess(action, result);
      return successResponse(h, result, "Income category updated successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  // DELETE (soft)
  async delete(request: Request, h: ResponseToolkit) {
    const action = "DELETE_INCOME_CATEGORY";

    try {
      const { id } = request.params;

      const payload: ISoftDeleteIncomeCategoryRequest = {
        userId: request.auth.credentials?.id as string,
      };

      const result = await incomeCategoriesService.softDelete(id, payload);

      logSuccess(action, result);
      return successResponse(h, result, "Income category deleted successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }
}

export const incomeCategoriesController = new IncomeCategoriesController();
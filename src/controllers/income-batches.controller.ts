import { incomeBatchesService } from "../services/income-batches.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  ICreateIncomeBatchRequest,
  IUpdateIncomeBatchRequest,
  ISoftDeleteIncomeBatchRequest,
  IIncomeBatchQuery,
} from "../types/requests/income-batches-request";

import { errorResponse, successResponse } from "../utils/response.util";
import { logSuccess, logError } from "../utils/logger.util";
import { AppError } from "../errors/app.error";

export class IncomeBatchesController {

  async getAll(request: Request, h: ResponseToolkit) {
    const action = "GET_ALL_INCOME_BATCHES";

    try {
      const query: IIncomeBatchQuery = request.query as any;
      const userId = request.auth.credentials?.id as string;
      const result = await incomeBatchesService.findAll(query, userId);

      logSuccess(action, result);
      return successResponse(
        h,
        result.data,
        "Income batches retrieved successfully",
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

  async getById(request: Request, h: ResponseToolkit) {
    const action = "GET_INCOME_BATCH_BY_ID";

    try {
      const { id } = request.params;
      const result = await incomeBatchesService.findById(id);

      logSuccess(action, result);
      return successResponse(h, result, "Income batch retrieved successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  async create(request: Request, h: ResponseToolkit) {
    const action = "CREATE_INCOME_BATCH";

    try {
      const payload = request.payload as ICreateIncomeBatchRequest;

      const data = {
        ...payload,
        createdBy: request.auth.credentials?.id as string,
      };

      const result = await incomeBatchesService.create(data);

      logSuccess(action, result);
      return successResponse(h, result, "Income batch created successfully", 201);

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  async update(request: Request, h: ResponseToolkit) {
    const action = "UPDATE_INCOME_BATCH";

    try {
      const { id } = request.params;
      const payload = request.payload as IUpdateIncomeBatchRequest;

      const data = {
        ...payload,
        updatedBy: request.auth.credentials?.id as string,
      };

      const result = await incomeBatchesService.update(id, data);

      logSuccess(action, result);
      return successResponse(h, result, "Income batch updated successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  async delete(request: Request, h: ResponseToolkit) {
    const action = "DELETE_INCOME_BATCH";

    try {
      const { id } = request.params;

      const payload: ISoftDeleteIncomeBatchRequest = {
        userId: request.auth.credentials?.id as string,
      };

      const result = await incomeBatchesService.softDelete(id, payload);

      logSuccess(action, result);
      return successResponse(h, result, "Income batch deleted successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }
}

export const incomeBatchesController = new IncomeBatchesController();
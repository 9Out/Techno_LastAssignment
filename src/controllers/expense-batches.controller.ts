// /controller/expense-batches.controller.ts
import { expenseBatchesService } from "../services/expense-batches.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  ICreateExpenseBatchRequest,
  IUpdateExpenseBatchRequest,
  ISoftDeleteExpenseBatchRequest,
  IExpenseBatchQuery,
  IApproveExpenseBatchRequest, // Import interface baru
  IRejectExpenseBatchRequest, // Import interface baru
} from "../types/requests/expense-batches-request";

import { errorResponse, successResponse } from "../utils/response.util";
import { logSuccess, logError } from "../utils/logger.util";
import { AppError } from "../errors/app.error";

export class ExpenseBatchesController {

  /**
   * @description Mengambil semua batch pengeluaran dengan filter dan pagination.
   */
  async getAll(request: Request, h: ResponseToolkit) {
    const action = "GET_ALL_EXPENSE_BATCHES";

    try {
      const query: IExpenseBatchQuery = request.query as any;
      const result = await expenseBatchesService.findAll(query);

      logSuccess(action, result);
      return successResponse(
        h,
        result.data,
        "Expense batches retrieved successfully",
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

  /**
   * @description Mengambil batch pengeluaran berdasarkan ID.
   */
  async getById(request: Request, h: ResponseToolkit) {
    const action = "GET_EXPENSE_BATCH_BY_ID";

    try {
      const { id } = request.params;
      const result = await expenseBatchesService.findById(id);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch retrieved successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  /**
   * @description Membuat batch pengeluaran baru.
   */
  async create(request: Request, h: ResponseToolkit) {
    const action = "CREATE_EXPENSE_BATCH";

    try {
      const payload = request.payload as ICreateExpenseBatchRequest;

      // Menambahkan createdBy dari kredensial otentikasi
      const data: ICreateExpenseBatchRequest = {
        ...payload,
        createdBy: request.auth.credentials?.id as string,
      };

      const result = await expenseBatchesService.create(data);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch created successfully", 201);

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  /**
   * @description Memperbarui batch pengeluaran yang sudah ada.
   */
  async update(request: Request, h: ResponseToolkit) {
    const action = "UPDATE_EXPENSE_BATCH";

    try {
      const { id } = request.params;
      const payload = request.payload as IUpdateExpenseBatchRequest;

      // Menambahkan updatedBy dari kredensial otentikasi
      const data: IUpdateExpenseBatchRequest = {
        ...payload,
        updatedBy: request.auth.credentials?.id as string,
      };

      const result = await expenseBatchesService.update(id, data);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch updated successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  /**
   * @description Menghapus (Soft Delete) batch pengeluaran.
   */
  async softDelete(request: Request, h: ResponseToolkit) {
    const action = "SOFT_DELETE_EXPENSE_BATCH";

    try {
      const { id } = request.params;

      const payload: ISoftDeleteExpenseBatchRequest = {
        userId: request.auth.credentials?.id as string,
      };

      const result = await expenseBatchesService.softDelete(id, payload);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch deleted successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  /**
   * @description Menyetujui (Approve) batch pengeluaran.
   */
  async approve(request: Request, h: ResponseToolkit) {
    const action = "APPROVE_EXPENSE_BATCH";

    try {
      const { id } = request.params;

      const payload: IApproveExpenseBatchRequest = {
        approvedBy: request.auth.credentials?.id as string,
      };

      const result = await expenseBatchesService.approve(id, payload);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch approved successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }

  /**
   * @description Menolak (Reject) batch pengeluaran.
   */
  async reject(request: Request, h: ResponseToolkit) {
    const action = "REJECT_EXPENSE_BATCH";

    try {
      const { id } = request.params;
      const payload = request.payload as IRejectExpenseBatchRequest; // Payload mungkin berisi alasan

      const data: IRejectExpenseBatchRequest = {
        ...payload,
        rejectedBy: request.auth.credentials?.id as string, // Menggunakan user yang melakukan aksi sebagai rejectedBy
      };

      const result = await expenseBatchesService.reject(id, data);

      logSuccess(action, result);
      return successResponse(h, result, "Expense batch rejected successfully");

    } catch (err: any) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Unexpected server error", 500);
    }
  }
}

export const expenseBatchesController = new ExpenseBatchesController();
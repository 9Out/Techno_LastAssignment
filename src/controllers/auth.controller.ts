// controllers/auth.controller.ts
import { Request, ResponseToolkit } from "@hapi/hapi";
import { authService } from "../services/auth.service";

import { ILoginRequest, IRegisterRequest,INewPasswordRequest } from "../types/requests/auth-request";

import { errorResponse, successResponse } from "../utils/response.util";
import { AppError } from "../errors/app.error";
import { logError, logSuccess } from "../utils/logger.util";

export class AuthController {
  // REGISTER
  async register(req: Request, h: ResponseToolkit) {
    const action = "REGISTER";

    try {
      const payload = req.payload as IRegisterRequest;

      const createdBy = (req.auth?.credentials as any)?.id;
      if (createdBy) payload.createdBy = createdBy;

      const result = await authService.register(payload);

      logSuccess(action, result);
      return successResponse(h, result, "Registration successful", 201);
    } catch (err) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Internal server error", 500);
    }
  }

  // LOGIN
  async login(req: Request, h: ResponseToolkit) {
    const action = "LOGIN";

    try {
      const payload = req.payload as ILoginRequest;
      const result = await authService.login(payload);

      logSuccess(action, result);
      return successResponse(h, result, "Login successful");
    } catch (err) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Internal server error", 500);
    }
  }

  // SET NEW PASSWORD
  async setNewPassword(req: Request, h: ResponseToolkit) {
    const action = "SET_NEW_PASSWORD";

    try {
      const payload = req.payload as INewPasswordRequest;

      const updatedBy = (req.auth?.credentials as any)?.id;
      if (updatedBy) payload.updatedBy = updatedBy;

      const data: INewPasswordRequest = {
        ...payload,
        email: req.auth.credentials?.email as string,
      };

      const result = await authService.setNewPassword(data);

      if (!result) {
        logError(action, "Failed to update password");
        return errorResponse(h, "Failed to update password", 400);
      }

      logSuccess(action, result);
      return successResponse(h, result, "Password successfully updated");
    } catch (err) {
      logError(action, err);

      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }

      return errorResponse(h, "Internal server error", 500);
    }
  }
}

export const authController = new AuthController();
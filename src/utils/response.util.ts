import { ResponseToolkit } from "@hapi/hapi";
import { ApiResponse } from "../types/responses/api-response";

/**
 * Success response
 * @param h Hapi ResponseToolkit
 * @param data Isi utama data
 * @param message Pesan response
 * @param code HTTP status code
 * @param meta Metadata (pagination dsb)
 */
export const successResponse = <T>(
  h: ResponseToolkit,
  data: T,
  message = "Request successful",
  code = 200,
  meta?: Record<string, any>
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return h.response(response).code(code);
};

/**
 * Error response
 * @param h Hapi ResponseToolkit
 * @param message Pesan error
 * @param code HTTP status code
 * @param errorCode Custom error code (opsional)
 */
export const errorResponse = (
  h: ResponseToolkit,
  message: string,
  code = 400,
  errorCode?: string,
  takeover = false
) => {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      message,
      status: code,
      code: errorCode,
    },
  };

  if (takeover) {
    return h.response(response).code(code).takeover();
  }

  return h.response(response).code(code);
};
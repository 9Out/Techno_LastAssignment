export class AppError extends Error {
  constructor(
    public code: string = "INTERNAL_SERVER_ERROR",  // default code
    public message: string = "An unexpected error occurred.", // default message
    public status: number = 500 // default HTTP status
  ) {
    super(message);
  }
}
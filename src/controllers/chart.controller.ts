import { Request, ResponseToolkit } from "@hapi/hapi";
import { chartService, IChartQuery } from "../services/chart.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { logSuccess, logError } from "../utils/logger.util";
import { AppError } from "../errors/app.error";

export class ChartController {
  
  async getFinancialSummary(request: Request, h: ResponseToolkit) {
    const action = "GET_FINANCIAL_SUMMARY";
    
    try {
      const userId = request.auth.credentials?. id as string;
      const query: IChartQuery = request.query as any;
      
      const result = await chartService.getFinancialSummary(userId, query);
      
      logSuccess(action, result);
      return successResponse(h, result, "Financial summary retrieved successfully");
      
    } catch (err:  any) {
      logError(action, err);
      
      if (err instanceof AppError) {
        return errorResponse(h, err. message, err.status, err.code);
      }
      
      return errorResponse(h, "Unexpected server error", 500);
    }
  }
  
  async getFinancialByPeriod(request: Request, h: ResponseToolkit) {
    const action = "GET_FINANCIAL_BY_PERIOD";
    
    try {
      const userId = request.auth.credentials?.id as string;
      const query: IChartQuery = request.query as any;
      
      const result = await chartService.getFinancialByPeriod(userId, query);
      
      logSuccess(action, result);
      return successResponse(h, result, "Financial data by period retrieved successfully");
      
    } catch (err: any) {
      logError(action, err);
      
      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }
      
      return errorResponse(h, "Unexpected server error", 500);
    }
  }
  
  async getExpenseByCategory(request: Request, h: ResponseToolkit) {
    const action = "GET_EXPENSE_BY_CATEGORY";
    
    try {
      const userId = request. auth.credentials?.id as string;
      const query: IChartQuery = request.query as any;
      
      const result = await chartService.getExpenseByCategory(userId, query);
      
      logSuccess(action, result);
      return successResponse(h, result, "Expense by category retrieved successfully");
      
    } catch (err: any) {
      logError(action, err);
      
      if (err instanceof AppError) {
        return errorResponse(h, err.message, err.status, err.code);
      }
      
      return errorResponse(h, "Unexpected server error", 500);
    }
  }
}

export const chartController = new ChartController();
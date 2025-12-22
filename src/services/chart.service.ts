import { and, eq, gte, isNull, lte, sql, sum } from "drizzle-orm";
import { db } from "../db/drizzleClient";
import { incomeBatches } from "../db/schemas/income-batches.scheme";
import { expenseBatches } from "../db/schemas/expense-batches.scheme";
import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";

export interface IChartQuery {
  fromDate?: Date;
  toDate?: Date;
  groupBy?: "day" | "week" | "month" | "year";
}

export class ChartService {
  
  // Get Income & Expense Summary by User ID
  async getFinancialSummary(userId:  string, query:  IChartQuery = {}) {
    const action = "GET_FINANCIAL_SUMMARY";
    
    try {
      const { fromDate, toDate } = query;
      const conditions = [isNull(incomeBatches. deletedAt)];
      
      // Filter by user
      conditions.push(eq(incomeBatches.createdBy, userId));
      
      // Filter by date range
      if (fromDate) conditions.push(gte(incomeBatches.incomeDate, fromDate.toISOString()));
      if (toDate) conditions.push(lte(incomeBatches.incomeDate, toDate.toISOString()));
      
      // Get total income
      const incomeResult = await db
        .select({ 
          total: sql<number>`COALESCE(SUM(CAST(${incomeBatches. totalAmount} AS NUMERIC)), 0)` 
        })
        .from(incomeBatches)
        .where(and(...conditions));
      
      // Get total expense
      const expenseConditions = [isNull(expenseBatches.deletedAt)];
      expenseConditions.push(eq(expenseBatches.createdBy, userId));
      if (fromDate) expenseConditions.push(gte(expenseBatches.expenseDate, fromDate.toISOString()));
      if (toDate) expenseConditions.push(lte(expenseBatches.expenseDate, toDate.toISOString()));
      
      const expenseResult = await db
        .select({ 
          total: sql<number>`COALESCE(SUM(CAST(${expenseBatches.totalAmount} AS NUMERIC)), 0)` 
        })
        .from(expenseBatches)
        .where(and(...expenseConditions));
      
      const totalIncome = incomeResult[0]?.total || 0;
      const totalExpense = expenseResult[0]?.total || 0;
      const balance = totalIncome - totalExpense;
      
      const result = {
        totalIncome,
        totalExpense,
        balance,
        userId
      };
      
      logSuccess(action, result);
      return result;
      
    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("CHART_FETCH_FAILED", "Failed to fetch chart data.", 500);
    }
  }
  
  // Get Income & Expense by Period (for line/bar chart)
  async getFinancialByPeriod(userId: string, query: IChartQuery = {}) {
    const action = "GET_FINANCIAL_BY_PERIOD";
    
    try {
      const { fromDate, toDate, groupBy = "month" } = query;
      
      let dateFormat:  string;
      switch (groupBy) {
        case "day":
          dateFormat = "YYYY-MM-DD";
          break;
        case "week": 
          dateFormat = "YYYY-WW";
          break;
        case "year":
          dateFormat = "YYYY";
          break;
        case "month":
        default:
          dateFormat = "YYYY-MM";
          break;
      }
      
      const conditions = [
        isNull(incomeBatches.deletedAt),
        eq(incomeBatches. createdBy, userId)
      ];
      
      if (fromDate) conditions.push(gte(incomeBatches.incomeDate, fromDate. toISOString()));
      if (toDate) conditions.push(lte(incomeBatches.incomeDate, toDate. toISOString()));
      
      // Income by period
      const incomeByPeriod = await db
        .select({
          period: sql<string>`TO_CHAR(${incomeBatches.incomeDate}, ${dateFormat})`,
          total: sql<number>`COALESCE(SUM(CAST(${incomeBatches.totalAmount} AS NUMERIC)), 0)`
        })
        .from(incomeBatches)
        .where(and(...conditions))
        .groupBy(sql`TO_CHAR(${incomeBatches.incomeDate}, ${dateFormat})`)
        .orderBy(sql`TO_CHAR(${incomeBatches.incomeDate}, ${dateFormat})`);
      
      // Expense by period
      const expenseConditions = [
        isNull(expenseBatches.deletedAt),
        eq(expenseBatches.createdBy, userId)
      ];
      
      if (fromDate) expenseConditions.push(gte(expenseBatches.expenseDate, fromDate.toISOString()));
      if (toDate) expenseConditions.push(lte(expenseBatches.expenseDate, toDate. toISOString()));
      
      const expenseByPeriod = await db
        .select({
          period: sql<string>`TO_CHAR(${expenseBatches.expenseDate}, ${dateFormat})`,
          total: sql<number>`COALESCE(SUM(CAST(${expenseBatches.totalAmount} AS NUMERIC)), 0)`
        })
        .from(expenseBatches)
        .where(and(...expenseConditions))
        .groupBy(sql`TO_CHAR(${expenseBatches.expenseDate}, ${dateFormat})`)
        .orderBy(sql`TO_CHAR(${expenseBatches.expenseDate}, ${dateFormat})`);
      
      // Combine results
      const allPeriods = new Set([
        ...incomeByPeriod.map(i => i.period),
        ...expenseByPeriod.map(e => e.period)
      ]);
      
      const chartData = Array.from(allPeriods).sort().map(period => {
        const income = incomeByPeriod.find(i => i.period === period)?.total || 0;
        const expense = expenseByPeriod.find(e => e. period === period)?.total || 0;
        
        return {
          period,
          income,
          expense,
          balance: income - expense
        };
      });
      
      logSuccess(action, chartData);
      return chartData;
      
    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("CHART_PERIOD_FETCH_FAILED", "Failed to fetch chart data by period.", 500);
    }
  }
  
  // Get Expense by Category (for pie chart)
  async getExpenseByCategory(userId: string, query: IChartQuery = {}) {
    const action = "GET_EXPENSE_BY_CATEGORY";
    
    try {
      const { fromDate, toDate } = query;
      const conditions = [
        isNull(expenseBatches.deletedAt),
        eq(expenseBatches.createdBy, userId)
      ];
      
      if (fromDate) conditions.push(gte(expenseBatches.expenseDate, fromDate.toISOString()));
      if (toDate) conditions.push(lte(expenseBatches.expenseDate, toDate.toISOString()));
      
      const result = await db
        .select({
          categoryId: expenseBatches.categoryId,
          total: sql<number>`COALESCE(SUM(CAST(${expenseBatches.totalAmount} AS NUMERIC)), 0)`
        })
        .from(expenseBatches)
        .where(and(...conditions))
        .groupBy(expenseBatches.categoryId);
      
      logSuccess(action, result);
      return result;
      
    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("EXPENSE_CATEGORY_FETCH_FAILED", "Failed to fetch expense by category.", 500);
    }
  }
}

export const chartService = new ChartService();
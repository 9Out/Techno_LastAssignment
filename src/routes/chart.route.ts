import { ServerRoute } from "@hapi/hapi";
import { chartController } from "../controllers/chart.controller";
import Joi from "joi";

const chartQuerySchema = Joi.object({
  fromDate: Joi.date().optional(),
  toDate: Joi.date().optional(),
  groupBy: Joi.string().valid("day", "week", "month", "year").optional()
});

export const chartRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/chart/summary",
    handler: chartController.getFinancialSummary,
    options: {
      auth: "jwt",
      tags: ["api", "Chart"],
      description: "Get financial summary (total income, expense, balance)",
      validate: {
        query: chartQuerySchema,
        failAction: (_, __, err) => {
          throw err;
        }
      }
    }
  },
  {
    method: "GET",
    path: "/chart/period",
    handler: chartController. getFinancialByPeriod,
    options: {
      auth: "jwt",
      tags: ["api", "Chart"],
      description: "Get income and expense data grouped by period",
      validate: {
        query: chartQuerySchema,
        failAction: (_, __, err) => {
          throw err;
        }
      }
    }
  },
  {
    method: "GET",
    path: "/chart/expense-category",
    handler: chartController.getExpenseByCategory,
    options: {
      auth: "jwt",
      tags:  ["api", "Chart"],
      description: "Get expense data grouped by category",
      validate: {
        query: chartQuerySchema,
        failAction: (_, __, err) => {
          throw err;
        }
      }
    }
  }
];
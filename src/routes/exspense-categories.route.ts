import { ServerRoute } from "@hapi/hapi";
import { expenseCategoriesController } from "../controllers/expense-categories.controller";
import { getAllExpenseCategoriesSchema, createExpenseCategorySchema, updateExpenseCategorySchema, findByIdCategoryParamScheme } from "../validations/expense-category.validation";
import { createExpenseCategoryResponseSchema } from "../lib/swagger/expense_categories/create-response.example";
import { findExpenseCategoryByIdResponseSchema } from "../lib/swagger/expense_categories/find-by-id-response.example";
import { getAllExpenseCategoriesResponseSchema } from "../lib/swagger/expense_categories/get-all-response.example";
import { deleteExpenseCategoryResponseSchema } from "../lib/swagger/expense_categories/delete-response.example";
import { updateExpenseCategoryResponseSchema } from "../lib/swagger/expense_categories/update-response.example";

export const expenseCategoriesRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/expense-categories",
    handler: expenseCategoriesController.getAll,
    options: {
      tags: ["api", "Expense Categories"],
      description: "Mengambil semua kategori pengeluaran",
      validate: {
        query: getAllExpenseCategoriesSchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: { status: { 200: getAllExpenseCategoriesResponseSchema } },
    },
  },
  {
    method: "GET",
    path: "/expense-categories/{id}",
    handler: expenseCategoriesController.getById,
    options: {
      tags: ["api", "3.1 Expense Categories"],
      description: "Mengambil detail kategori pengeluaran berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: { status: { 200: findExpenseCategoryByIdResponseSchema } },
    },
  },
  {
    method: "POST",
    path: "/expense-categories",
    handler: expenseCategoriesController.create,
    options: {
      tags: ["api", "3.1 Expense Categories"],
      description: "Membuat kategori pengeluaran baru",
      validate: {
        payload: createExpenseCategorySchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: { status: { 201: createExpenseCategoryResponseSchema } },
    },
  },
  {
    method: "PATCH",
    path: "/expense-categories/{id}",
    handler: expenseCategoriesController.update,
    options: {
      tags: ["api", "3.1 Expense Categories"],
      description: "Memperbarui kategori pengeluaran berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        payload: updateExpenseCategorySchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: { status: { 200: updateExpenseCategoryResponseSchema } },
    },
  },
  {
    method: "DELETE",
    path: "/expense-categories/{id}",
    handler: expenseCategoriesController.delete,
    options: {
      tags: ["api", "3.1 Expense Categories"],
      description: "Menghapus kategori pengeluaran berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: { status: { 200: deleteExpenseCategoryResponseSchema } },
    },
  },
];
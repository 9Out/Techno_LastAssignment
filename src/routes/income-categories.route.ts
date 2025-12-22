import { ServerRoute } from "@hapi/hapi";
import { incomeCategoriesController } from "../controllers/income-categories.controller";
import { createIncomeCategorySchema, getAllIncomeCategoriesSchema, findByIdCategoryParamScheme, updateIncomeCategorySchema } from "../validations/income-category.validation";
import { createIncomeCategoryResponseSchema } from "../lib/swagger/incoming_categories/create-response.example";
import { getAllIncomeCategoriesResponseSchema } from "../lib/swagger/incoming_categories/get-all-response.example";
import { updateIncomeCategoryResponseSchema } from "../lib/swagger/incoming_categories/update-response.example";
import { findIncomeCategoryByIdResponseSchema } from "../lib/swagger/incoming_categories/find-by-id-response.example";
import { deleteIncomeCategoryResponseSchema } from "../lib/swagger/incoming_categories/delete-response.example";

export const incomeCategoriesRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/income-categories",
    handler: incomeCategoriesController.getAll,
    options: {
      tags: ["api", "2.1 Income Categories"],
      description: "Mengambil semua kategori pendapatan",
      validate: {
        query: getAllIncomeCategoriesSchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: getAllIncomeCategoriesResponseSchema,
        },
      },
    },
  },
  {
    method: "GET",
    path: "/income-categories/{id}",
    handler: incomeCategoriesController.getById,
    options: {
      tags: ["api", "2.1 Income Categories"],
      description: "Mengambil detail kategori pendapatan berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: findIncomeCategoryByIdResponseSchema,
        },
      },
    },
  },
  {
    method: "POST",
    path: "/income-categories",
    handler: incomeCategoriesController.create,
    options: {
      tags: ["api", "2.1 Income Categories"],
      description: "Membuat kategori pendapatan baru",
      validate: {
        payload: createIncomeCategorySchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          201: createIncomeCategoryResponseSchema,
        },
      },
    },
  },
  {
    method: "PATCH",
    path: "/income-categories/{id}",
    handler: incomeCategoriesController.update,
    options: {
      tags: ["api", "2.1 Income Categories"],
      description: "Memperbarui kategori pendapatan berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        payload: updateIncomeCategorySchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          201: updateIncomeCategoryResponseSchema,
        },
      },
    },
  },
  {
    method: "DELETE",
    path: "/income-categories/{id}",
    handler: incomeCategoriesController.delete,
    options: {
      tags: ["api", "2.1 Income Categories"],
      description: "Menghapus kategori pendapatan berdasarkan ID",
      validate: {
        params: findByIdCategoryParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: deleteIncomeCategoryResponseSchema,
        },
      },
    },
  },
];
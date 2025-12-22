import { ServerRoute } from "@hapi/hapi";
import { incomeBatchesController } from "../controllers/income-batches.controller";
import { createIncomeBatchSchema, findByIdIncomeBatchParamScheme, getAllIncomeBatchesQuerySchema, updateIncomeBatchSchema } from "../validations/income-batch.validation";
import { createIncomeBatchResponseSchema } from "../lib/swagger/incoming_batches/create-response.example";
import { getAllIncomeBatchesResponseSchema } from "../lib/swagger/incoming_batches/get-all-response.example";
import { findIncomeBatchByIdResponseSchema } from "../lib/swagger/incoming_batches/find-by-id-response.example";
import { updateIncomeBatchResponseSchema } from "../lib/swagger/incoming_batches/update-response.example";
import { deleteIncomeBatchResponseSchema } from "../lib/swagger/incoming_batches/delete-response.example";

export const incomeBatchesRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/income-batches",
    handler: incomeBatchesController.getAll,
    options: {
      tags: ["api", "2.2 Income Batches"],
      description: "Mengambil semua income batches",
      validate: {
        query: getAllIncomeBatchesQuerySchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: getAllIncomeBatchesResponseSchema,
        },
      },
    },
  },
  {
    method: "GET",
    path: "/income-batches/{id}",
    handler: incomeBatchesController.getById,
    options: {
      tags: ["api", "2.2 Income Batches"],
      description: "Mengambil detail income batch berdasarkan ID",
      validate: {
        params: findByIdIncomeBatchParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: findIncomeBatchByIdResponseSchema,
        },
      },
    },
  },
  {
    method: "POST",
    path: "/income-batches",
    handler: incomeBatchesController.create,
    options: {
      tags: ["api", "2.2 Income Batches"],
      description: "Membuat income batch baru",
      validate: {
        payload: createIncomeBatchSchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          201: createIncomeBatchResponseSchema,
        },
      },
    },
  },
  {
    method: "PATCH",
    path: "/income-batches/{id}",
    handler: incomeBatchesController.update,
    options: {
      tags: ["api", "2.2 Income Batches"],
      description: "Memperbarui income batch berdasarkan ID",
      validate: {
        payload: updateIncomeBatchSchema,
        params: findByIdIncomeBatchParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          201: updateIncomeBatchResponseSchema,
        },
      },
    },
  },
  {
    method: "DELETE",
    path: "/income-batches/{id}",
    handler: incomeBatchesController.delete,
    options: {
      tags: ["api", "2.2 Income Batches"],
      description: "Menghapus income batch berdasarkan ID",
        validate: {
        params: findByIdIncomeBatchParamScheme,
        failAction: (_, __, err) => {
          throw err;
        },
      },
       response: {
        status: {
          200: deleteIncomeBatchResponseSchema,
        },
      },
    },
  },
];
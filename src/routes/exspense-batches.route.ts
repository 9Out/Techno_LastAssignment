// file: expense-batches.routes.ts

import { ServerRoute } from "@hapi/hapi";
import { expenseBatchesController } from "../controllers/expense-batches.controller";
import { 
    createExpenseBatchSchema, 
    findByIdExpenseBatchParamScheme, 
    getAllExpenseBatchesQuerySchema, 
    updateExpenseBatchSchema,
} from "../validations/expense-batch.validation";
import { createExpenseBatchResponseSchema } from "../lib/swagger/expense_batches/create-response.example";
import { getAllExpenseBatchesResponseSchema } from "../lib/swagger/expense_batches/get-all-response.example";
import { findExpenseBatchByIdResponseSchema } from "../lib/swagger/expense_batches/find-by-id-response.example";
import { updateExpenseBatchResponseSchema } from "../lib/swagger/expense_batches/update-response.example";
import { deleteExpenseBatchResponseSchema } from "../lib/swagger/expense_batches/delete-response.example";  

export const expenseBatchesRoutes: ServerRoute[] = [
    // 1. GET ALL
    {
        method: "GET",
        path: "/expense-batches",
        handler: expenseBatchesController.getAll,
        options: {
            tags: ["api", "3.2 Expense Batches"],
            description: "Mengambil semua expense batches",
            validate: {
                query: getAllExpenseBatchesQuerySchema,
                failAction: (_, __, err) => {
                    throw err;
                },
            },
            response: {
                status: {
                    200: getAllExpenseBatchesResponseSchema,
                },
            },
        },
    },
    // 2. GET BY ID
    {
        method: "GET",
        path: "/expense-batches/{id}",
        handler: expenseBatchesController.getById,
        options: {
            tags: ["api", "3.2 Expense Batches"],
            description: "Mengambil detail expense batch berdasarkan ID",
            validate: {
                params: findByIdExpenseBatchParamScheme,
                failAction: (_, __, err) => {
                    throw err;
                },
            },
            response: {
                status: {
                    200: findExpenseBatchByIdResponseSchema,
                },
            },
        },
    },
    // 3. CREATE
    {
        method: "POST",
        path: "/expense-batches",
        handler: expenseBatchesController.create,
        options: {
            tags: ["api", "3.2 Expense Batches"],
            description: "Membuat expense batch baru",
            validate: {
                payload: createExpenseBatchSchema,
                failAction: (_, __, err) => {
                    throw err;
                },
            },
            response: {
                status: {
                    201: createExpenseBatchResponseSchema,
                },
            },
        },
    },
    // 4. UPDATE
    {
        method: "PATCH",
        path: "/expense-batches/{id}",
        handler: expenseBatchesController.update,
        options: {
            tags: ["api", "3.2 Expense Batches"],
            description: "Memperbarui expense batch berdasarkan ID",
            validate: {
                payload: updateExpenseBatchSchema,
                params: findByIdExpenseBatchParamScheme,
                failAction: (_, __, err) => {
                    throw err;
                },
            },
            response: {
                status: {
                    200: updateExpenseBatchResponseSchema, // Menggunakan 200/201
                },
            },
        },
    },
    // 5. SOFT DELETE
    {
        method: "DELETE",
        path: "/expense-batches/{id}",
        handler: expenseBatchesController.softDelete,
        options: {
            tags: ["api", "3.2 Expense Batches"],
            description: "Menghapus (soft delete) expense batch berdasarkan ID",
            validate: {
                params: findByIdExpenseBatchParamScheme,
                failAction: (_, __, err) => {
                    throw err;
                },
            },
            response: {
                status: {
                    200: deleteExpenseBatchResponseSchema,
                },
            },
        },
    },
];
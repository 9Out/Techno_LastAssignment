// file: /lib/swagger/expense_batches/create-response-example.ts

import Joi from "joi";

const createExpenseBatchResponseExample = {
  success: true,
  message: "Expense batch created successfully",
  data: {
    id: "f3a4b5c6-d7e8-90a1-b2c3-d4e5f6a7b8c9",
    
    // Field Utama
    categoryId: "bbec0be8-8cc4-48b5-9af7-4d57e412629b",
    expenseDate: "2025-07-01",
    totalAmount: "5500000.00",
    
    description: "Pembelian alat tulis kantor",

    // Field Audit
    createdAt: "2025-12-12T13:40:43.000Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  },
};

export const createExpenseBatchResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    
    // Field Utama
    categoryId: Joi.string().uuid().required(),
    expenseDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    totalAmount: Joi.string().required(),

    description: Joi.string().allow("", null),

    // Field Audit
    createdBy: Joi.string().uuid().required(),
    createdAt: Joi.date().required(),
    updatedBy: Joi.string().uuid().allow(null),
    updatedAt: Joi.date().allow(null),
    deletedAt: Joi.date().allow(null),
    deletedBy: Joi.string().uuid().allow(null),
    
  }).required(),
}).example(createExpenseBatchResponseExample);
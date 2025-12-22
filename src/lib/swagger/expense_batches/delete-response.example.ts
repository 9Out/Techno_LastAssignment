// file: /lib/swagger/expense_batches/delete-response-example.ts

import Joi from "joi";

const deleteExpenseBatchResponseExample = {
  success: true,
  message: "Expense batch deleted successfully",
  data: {
    id: "f3a4b5c6-d7e8-90a1-b2c3-d4e5f6a7b8c9",
    
    // Field Utama
    categoryId: "bbec0be8-8cc4-48b5-9af7-4d57e412629b",
    expenseDate: "2025-07-01",
    totalAmount: "5500000.00",
    
    description: "Pembelian alat tulis kantor untuk Q3",

    // Field Audit
    createdAt: "2025-12-10T13:40:43.000Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: "2025-12-11T10:00:00.000Z", // Waktu update terakhir (mungkin waktu approve)
    updatedBy: "8f7e6d5c-b4a3-21c0-9d8e-7f6a5b4c3d2e",
    
    // Soft Delete Fields (WAJIB TERISI)
    deletedAt: "2025-12-12T13:54:00.000Z",
    deletedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
  },
};

export const deleteExpenseBatchResponseSchema = Joi.object({
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
    
    // Soft Delete Fields (Harus diisi setelah soft delete)
    deletedAt: Joi.date().required().allow(null), // Null hanya untuk skema, tapi di response delete harus terisi
    deletedBy: Joi.string().uuid().required().allow(null), // Sama seperti deletedAt
    
  }).required(),
}).example(deleteExpenseBatchResponseExample);
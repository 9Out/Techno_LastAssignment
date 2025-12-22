// file: /lib/swagger/expense_batches/get-all-response.example.ts

import Joi from "joi";

const getAllExpenseBatchesResponseExample = {
  success: true,
  message: "Expense batches retrieved successfully",
  data: [
    {
      id: "f3a4b5c6-d7e8-90a1-b2c3-d4e5f6a7b8c9",
      
      // Field Utama
      categoryId: "bbec0be8-8cc4-48b5-9af7-4d57e412629b",
      expenseDate: "2025-07-01",
      totalAmount: "5500000.00",
      
      // Field Opsional/Nullable
      // refNo: "REF/EXP/2025/001", // [red] aktifkan jika dibutuhkan
      // accountId: "4d57e412-629b-8cc4-48b5-9af7bbec0be8", // [red] aktifkan jika dibutuhkan
      vendorName: "PT. Alat Tulis Jaya",
      description: "Pembelian alat tulis kantor untuk Q3",
      attachmentUrl: "https://storage.example.com/bukti/001.pdf",
      
      // Field Approval (Contoh: Sudah disetujui)
      approvedAt: "2025-12-11T10:00:00.000Z",
      approvedBy: "8f7e6d5c-b4a3-21c0-9d8e-7f6a5b4c3d2e",
      
      // Field Rejection 
      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,

      // Field Audit
      createdAt: "2025-12-10T13:40:43.000Z",
      createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
      updatedAt: "2025-12-11T10:00:00.000Z",
      updatedBy: "8f7e6d5c-b4a3-21c0-9d8e-7f6a5b4c3d2e",
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      
      // Field Utama Batch Kedua
      categoryId: "a0a1a2a3-b4b5-c6c7-d8d9-e0e1e2e3e4e5",
      expenseDate: "2025-08-01",
      totalAmount: "1200000.00",
      
      // Field Opsional/Nullable
      // refNo: "REF/EXP/2025/002", // [red] aktifkan jika dibutuhkan
      // accountId: "11111111-2222-3333-4444-555555555555", // [red] aktifkan jika dibutuhkan
      vendorName: "Warung Makan Bunda",
      description: "Biaya konsumsi rapat guru",
      attachmentUrl: null,
      
      // Field Approval (Contoh: Belum disetujui)
      approvedAt: null,
      approvedBy: null,
      
      // Field Rejection 
      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,

      // Field Audit
      createdAt: "2025-12-12T09:00:00.000Z",
      createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    },
  ],
  meta: {
    total: 2,
    page: 1,
    perPage: 10,
    totalPages: 1,
  },
};

// Skema untuk satu item Expense Batch
const expenseBatchItemSchema = Joi.object({
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
});

export const getAllExpenseBatchesResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.array()
    .items(expenseBatchItemSchema)
    .required(),
  meta: Joi.object({
    total: Joi.number().required(),
    page: Joi.number().required(),
    perPage: Joi.number().required(),
    totalPages: Joi.number().required(),
  }).required(),
}).example(getAllExpenseBatchesResponseExample);
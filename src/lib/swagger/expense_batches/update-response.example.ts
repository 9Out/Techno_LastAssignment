// file: /lib/swagger/expense_batches/update-response-example.ts

import Joi from "joi";

const updateExpenseBatchResponseExample = {
  success: true,
  message: "Expense batch updated successfully",
  data: {
    id: "f3a4b5c6-d7e8-90a1-b2c3-d4e5f6a7b8c9",
    
    // Field Utama
    categoryId: "bbec0be8-8cc4-48b5-9af7-4d57e412629b",
    expenseDate: "2025-07-01",
    totalAmount: "6000000.00", // Nilai ini diasumsikan diubah dari 5500000.00
    
    // Field Opsional/Nullable
    // refNo: "REF/EXP/2025/001/REV", // [red] aktifkan jika dibutuhkan
    // accountId: "4d57e412-629b-8cc4-48b5-9af7bbec0be8", // [red] aktifkan jika dibutuhkan
    vendorName: "CV. Alat Tulis Makmur", // Nilai ini diasumsikan diubah
    description: "Perubahan kuantitas barang",
    attachmentUrl: "https://storage.example.com/bukti/001_rev.pdf",
    
    // Field Approval (Status Approval tidak berubah saat update data dasar)
    approvedAt: null,
    approvedBy: null,
    
    // Field Rejection (Status Rejection tidak berubah saat update data dasar)
    rejectedAt: null,
    rejectedBy: null,
    rejectionReason: null,

    // Field Audit
    createdAt: "2025-12-10T13:40:43.000Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: "2025-12-12T14:06:14.000Z", // WAJIB TERISI DENGAN WAKTU UPDATE BARU
    updatedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1", // ID user yang melakukan update
    deletedAt: null,
    deletedBy: null,
  },
};

export const updateExpenseBatchResponseSchema = Joi.object({
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
    updatedBy: Joi.string().uuid().required(), // Wajib ada setelah update
    updatedAt: Joi.date().required(),         // Wajib ada setelah update
    deletedAt: Joi.date().allow(null),
    deletedBy: Joi.string().uuid().allow(null),
    
  }).required(),
}).example(updateExpenseBatchResponseExample);
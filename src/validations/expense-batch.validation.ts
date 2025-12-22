// file: expense-batches.validation.ts

import Joi from "joi";

// Regular expression untuk validasi format YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Regular expression untuk validasi nilai numerik/decimal
const decimalRegex = /^\d+(\.\d{1,2})?$/;

// ============================
// EXPENSE BATCHES
// ============================

// Find By ID
export const findByIdExpenseBatchParamScheme = Joi.object({
  id: Joi.string().uuid().required().example("5c704de2-095e-435d-a154-fa198d892f54"),
});

// GET ALL
export const getAllExpenseBatchesQuerySchema = Joi.object({
  search: Joi.string().optional().description("Filter deskripsi atau nama vendor"),
  categoryId: Joi.string().uuid().optional(),
  fromDate: Joi.date().optional().description("Filter berdasarkan tanggal awal rentang expenseDate (YYYY-MM-DD)"),
  toDate: Joi.date().optional().description("Filter berdasarkan tanggal akhir rentang expenseDate (YYYY-MM-DD)"),
  sortBy: Joi.string().valid("createdAt", "totalAmount", "vendorName", "expenseDate").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
});

// Create
export const createExpenseBatchSchema = Joi.object({
  // Field Wajib
  categoryId: Joi.string().uuid().required().example("bbec0be8-8cc4-48b5-9af7-4d57e412629b"),

  expenseDate: Joi.string()
    .required()
    .pattern(dateRegex)
    .example("2025-07-01")
    .messages({
      "string.pattern.base": "expenseDate harus format YYYY-MM-DD",
    }),

  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .required()
    .example("5500000")
    .messages({
      "string.pattern.base": "totalAmount harus numeric",
    }),

  // Field Opsional/Nullable (Sesuai skema expenseBatches)
  // refNo: Joi.string().allow("").optional().example("REF/EXP/2025/001"),  // [red] Nomor bukti/voucher
  // accountId: Joi.string().uuid().optional().allow(null).example("4d57e412-629b-8cc4-48b5-9af7bbec0be8"), // [red] FK ke accounts
  vendorName: Joi.string().allow("").optional().example("PT. Alat Tulis Jaya"),
  description: Joi.string().allow("").optional().example("Pembelian alat tulis kantor untuk Q3"),
  attachmentUrl: Joi.string().uri().optional().allow(null).example("https://storage.example.com/bukti/001.pdf"),

  // createdBy tidak perlu divalidasi dari payload karena diambil dari request.auth
});

// Update
export const updateExpenseBatchSchema = Joi.object({
  // Semua field opsional
  categoryId: Joi.string().uuid().optional().example("042ef9c7-4cb2-4547-a7d7-9db404e3a4ce"),

  expenseDate: Joi.string()
    .pattern(dateRegex)
    .optional()
    .example("2025-07-15")
    .messages({ "string.pattern.base": "expenseDate harus format YYYY-MM-DD" }),

  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .optional()
    .messages({ "string.pattern.base": "totalAmount harus numeric" })
    .example("6000000"),
    
  // Field Opsional/Nullable
  // refNo: Joi.string().allow("", null).optional().example("REF/EXP/2025/001/REV"), // [red] Nomor bukti/voucher
  // accountId: Joi.string().uuid().optional().allow(null).example("4d57e412-629b-8cc4-48b5-9af7bbec0be8"), // [red] FK ke accounts
  vendorName: Joi.string().allow("", null).optional().example("CV. Alat Tulis Makmur"),
  description: Joi.string().allow("", null).optional().example("Perubahan kuantitas barang"),
  attachmentUrl: Joi.string().uri().optional().allow(null).example("https://storage.example.com/bukti/001_rev.pdf"),

  // updatedBy tidak perlu divalidasi dari payload karena diambil dari request.auth
}).min(1); // Memastikan minimal ada satu field yang di-update

// Reject (Hanya membutuhkan alasan penolakan jika ada)
export const rejectExpenseBatchSchema = Joi.object({
  rejectionReason: Joi.string().optional().allow("").example("Anggaran tidak mencukupi untuk periode ini."),
  // rejectedBy tidak perlu divalidasi dari payload karena diambil dari request.auth
});

// Approve tidak membutuhkan payload di body (hanya ID dari params request.auth)
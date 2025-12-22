// file: expense-batches.validation.ts

import Joi from "joi";

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
  fromDate: Joi.date().iso().optional().description("Filter berdasarkan tanggal awal rentang expenseDate (YYYY-MM-DD)"),
  toDate: Joi.date().iso().optional().description("Filter berdasarkan tanggal akhir rentang expenseDate (YYYY-MM-DD)"),
  sortBy: Joi.string().valid("createdAt", "totalAmount", "vendorName", "expenseDate").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
});

// Create
export const createExpenseBatchSchema = Joi.object({
  // Field Wajib
  categoryId: Joi.string().uuid().required().example("bbec0be8-8cc4-48b5-9af7-4d57e412629b"),

  expenseDate: Joi.date()
    .iso() // Memastikan format tanggal standar (YYYY-MM-DD)
    .required()
    .example("2025-07-12")
    .messages({
      "date.format": "expenseDate harus format YYYY-MM-DD",
      "date.base": "expenseDate harus berupa tanggal yang valid",
    }),

  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .required()
    .example("5500000")
    .messages({
      "string.pattern.base": "totalAmount harus numeric",
    }),

  description: Joi.string().allow("").optional().example("Pembelian alat tulis kantor untuk Q3"),

  // createdBy tidak perlu divalidasi dari payload karena diambil dari request.auth
});

// Update
export const updateExpenseBatchSchema = Joi.object({
  // Semua field opsional
  categoryId: Joi.string().uuid().optional().example("042ef9c7-4cb2-4547-a7d7-9db404e3a4ce"),

  expenseDate: Joi.date()
    .iso() // Memastikan format tanggal standar (YYYY-MM-DD)
    .required()
    .example("2025-07-12")
    .messages({
      "date.format": "expenseDate harus format YYYY-MM-DD",
      "date.base": "expenseDate harus berupa tanggal yang valid",
    }),

  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .optional()
    .messages({ "string.pattern.base": "totalAmount harus numeric" })
    .example("6000000"),
    
  description: Joi.string().allow("", null).optional().example("Perubahan kuantitas barang"),

  // updatedBy tidak perlu divalidasi dari payload karena diambil dari request.auth
}).min(1); // Memastikan minimal ada satu field yang di-update


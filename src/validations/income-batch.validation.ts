import Joi from "joi";

// Regular expression untuk validasi nilai numerik/decimal
const decimalRegex = /^\d+(\.\d{1,2})?$/;

// ============================
// INCOME BATCHES
// ============================

// Find By ID
export const findByIdIncomeBatchParamScheme = Joi.object({
  id: Joi.string().required().example("5c704de2-095e-435d-a154-fa198d892f54"),
});

export const getAllIncomeBatchesQuerySchema = Joi.object({
  search: Joi.string().optional().description("Untuk description"),
  categoryId: Joi.string().optional(),
  fromDate: Joi.date().iso().optional().description("fromDate harus format YYYY-MM-DD"),
  toDate: Joi.date().iso().optional().description("toDate harus format YYYY-MM-DD"),
  sortBy: Joi.string().valid("createdAt", "totalAmount").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
});

// Create
export const createIncomeBatchSchema = Joi.object({
  categoryId: Joi.string().uuid().required().example("bbec0be8-8cc4-48b5-9af7-4d57e412629b"),

  incomeDate: Joi.date()
    .iso() // Memastikan format tanggal standar (YYYY-MM-DD)
    .required()
    .example("2025-07-12")
    .messages({
      "date.format": "incomeDate harus format YYYY-MM-DD",
      "date.base": "incomeDate harus berupa tanggal yang valid",
    }),

  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .required()
    .example("12500000")
    .messages({
      "string.pattern.base": "totalAmount harus numeric",
    }),

  description: Joi.string().allow("").optional().example("Ini untuk spp satu satu per-tanggal 7 Desember"),
});

// Update
export const updateIncomeBatchSchema = Joi.object({
  categoryId: Joi.string().optional().example("042ef9c7-4cb2-4547-a7d7-9db404e3a4ce"),
  
  incomeDate: Joi.date()
    .iso() // Memastikan format tanggal standar (YYYY-MM-DD)
    .required()
    .example("2025-07-12")
    .messages({
      "date.format": "incomeDate harus format YYYY-MM-DD",
      "date.base": "incomeDate harus berupa tanggal yang valid",
    }),
  
  totalAmount: Joi.string()
    .pattern(decimalRegex)
    .required()
    .example("12500000")
    .messages({
      "string.pattern.base": "totalAmount harus numeric",
    }),

  description: Joi.string().optional().allow("").example("Ini perubahan deskripsinya"),
});
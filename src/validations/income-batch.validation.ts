import Joi from "joi";
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
  fromDate: Joi.date().optional().description("fromDate harus format YYYY-MM-DD"),
  toDate: Joi.date().optional().description("toDate harus format YYYY-MM-DD"),
  sortBy: Joi.string().valid("createdAt", "totalAmount").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  perPage: Joi.number().integer().min(1).optional(),
});

// Create
export const createIncomeBatchSchema = Joi.object({
  categoryId: Joi.string().uuid().required().example("bbec0be8-8cc4-48b5-9af7-4d57e412629b"),

  incomeDate: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .example("2025-07-12")
    .messages({
      "string.pattern.base": "incomeDate harus format YYYY-MM-DD",
    }),

  totalAmount: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
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
  incomeDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .example("2025-05-01")
    .optional()
    .messages({ 
      "string.pattern.base": "incomeDate harus format YYYY-MM-DD", 
    }),
  totalAmount: Joi.string().optional().messages({ "string.pattern.base": "totalAmount harus numeric" }).example("25000000"),
  description: Joi.string().optional().allow("").example("Ini perubahan deskripsinya"),
});
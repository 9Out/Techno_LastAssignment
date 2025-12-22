import Joi from "joi";

// ============================
// EXPENSE CATEGORIES
// ============================

// Find By ID (sama, bisa direuse kalau mau)
export const findByIdCategoryParamScheme = Joi.object({
  id: Joi.string()
    .required()
    .example("b0d90b92-7918-4fe7-8fd3-da12a3258a0f"),
});

// ============================
// GET ALL
// ============================
export const getAllExpenseCategoriesSchema = Joi.object({
  search: Joi.string().optional().allow("").example("Belanja"),
  code: Joi.string().optional().allow("").example("belanja"),

  fromDate: Joi.date().iso().optional().example("2025-12-01"),
  toDate: Joi.date().iso().optional().example("2025-12-31"),

  sortBy: Joi.string()
    .valid("name", "code", "createdAt")
    .optional()
    .default("createdAt")
    .example("name"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .optional()
    .default("asc")
    .example("asc"),

  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .example(1),

  perPage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .example(10),
});

// ============================
// CREATE
// ============================
export const createExpenseCategorySchema = Joi.object({
  name: Joi.string()
    .max(150)
    .required()
    .example("Belanja"),

  description: Joi.string()
    .optional()
    .allow("")
    .example("Pengeluaran belanja"),
});

// ============================
// UPDATE
// ============================
export const updateExpenseCategorySchema = Joi.object({
  name: Joi.string()
    .max(150)
    .optional()
    .example("Belanja Terbaru"),

  description: Joi.string()
    .optional()
    .allow("")
    .example("Pembaruan belanja"),
});
import Joi from "joi";

// ============================
// INCOME CATEGORIES
// ============================

// Find By ID
export const findByIdCategoryParamScheme = Joi.object({
  id: Joi.string().required().example("b0d90b92-7918-4fe7-8fd3-da12a3258a0f"),
});

export const getAllIncomeCategoriesSchema = Joi.object({
  search: Joi.string().optional().allow("").example("Gaji"),
  code: Joi.string().optional().allow("").example("gaji"),
  fromDate: Joi.date().optional().example("2025-12-01"),
  toDate: Joi.date().optional().example("2025-12-31"),

  sortBy: Joi.string().valid("name", "code", "createdAt").optional().default("createdAt").example("name"),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("asc").example("asc"),

  page: Joi.number().integer().min(1).optional().default(1).example(1),
  perPage: Joi.number().integer().min(1).max(100).optional().default(10).example(10),
});

// Create
export const createIncomeCategorySchema = Joi.object({
  name: Joi.string().max(150).required().example("Gaji"),
  description: Joi.string().optional().allow("").example("Ini kategori Gaji"),
});

// Update
export const updateIncomeCategorySchema = Joi.object({
  name: Joi.string().max(150).optional().example("Gaji Terbaru"),
  description: Joi.string().optional().allow("").example("Ini deskripsi Beda"),
});
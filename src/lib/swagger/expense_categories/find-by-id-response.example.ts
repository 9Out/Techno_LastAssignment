import Joi from "joi";

const findExpenseCategoryByIdResponseExample = {
  success: true,
  message: "Expense category retrieved successfully",
  data: {
    id: "9e97bb21-2535-434f-8cbc-ac76d76700f2",
    code: "belanja",
    name: "Belanja",
    description: "Pengeluaran belanja",
    createdAt: "2025-12-09T15:05:40.596Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null
  }
};

export const findExpenseCategoryByIdResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null).optional(),

    createdBy: Joi.string().uuid().required(),
    createdAt: Joi.date().required(),

    updatedBy: Joi.string().uuid().allow(null),
    updatedAt: Joi.date().allow(null),

    deletedBy: Joi.string().uuid().allow(null),
    deletedAt: Joi.date().allow(null),
  }).required(),
}).example(findExpenseCategoryByIdResponseExample);
import Joi from "joi";

const createExpenseCategoryResponseExample = {
  success: true,
  message: "Expense category created successfully",
  data: {
    id: "e210c685-2adc-44c2-9a05-243bae6dd7e1",
    code: "belanja",
    name: "Belanja",
    description: "Pengeluaran",
    createdAt: "2025-12-09T14:55:57.878Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  },
};

export const createExpenseCategoryResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),

    createdBy: Joi.string().uuid().required(),
    createdAt: Joi.date().required(),

    updatedBy: Joi.string().uuid().allow(null),
    updatedAt: Joi.date().allow(null),

    deletedAt: Joi.date().allow(null),
    deletedBy: Joi.string().uuid().allow(null),
  }).required(),
}).example(createExpenseCategoryResponseExample);
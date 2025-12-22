import Joi from "joi";

export const getAllExpenseCategoriesResponseExample = {
  success: true,
  message: "Expense categories retrieved successfully",
  data: [
    {
      id: "9e97bb21-2535-434f-8cbc-ac76d76700f2",
      code: "belanja",
      name: "Belanja",
      description: "Pengeluaran belanja",
      createdAt: "2025-12-09T15:05:40.596Z",
      createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    },
  ],
  meta: {
    total: 1,
    page: 1,
    perPage: 10,
    totalPages: 1,
  },
};

const expenseCategoryItemSchema = Joi.object({
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
});

const metaSchema = Joi.object({
  total: Joi.number().required(),
  page: Joi.number().required(),
  perPage: Joi.number().required(),
  totalPages: Joi.number().required(),
});

export const getAllExpenseCategoriesResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.array().items(expenseCategoryItemSchema).required(),
  meta: metaSchema.required(),
}).example(getAllExpenseCategoriesResponseExample);

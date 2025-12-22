import Joi from "joi";

export const getAllIncomeCategoriesResponseExample = {
  success: true,
  message: "Income categories retrieved successfully",
  data: [
    {
      id: "b0d90b92-7918-4fe7-8fd3-da12a3258a0f",
      code: "gaji",
      name: "Gaji",
      description: "Ini kategori gaji",
      createdAt: "2025-12-05T14:09:21.586Z",
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

const incomeCategoryItemSchema = Joi.object({
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

export const getAllIncomeCategoriesResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.array().items(incomeCategoryItemSchema).required(),
  meta: metaSchema.required(),
}).example(getAllIncomeCategoriesResponseExample);
import Joi from "joi";

const createIncomeCategoryResponseExample = {
  success: true,
  message: "Income category created successfully",
  data: {
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
};

export const createIncomeCategoryResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),
    createdBy: Joi.string().uuid().allow(null),
    createdAt: Joi.date().required(),
    updatedBy: Joi.string().uuid().allow(null),
    updatedAt: Joi.date().allow(null),
    deletedAt: Joi.date().allow(null),
    deletedBy: Joi.string().uuid().allow(null),
  }).required(),
}).example(createIncomeCategoryResponseExample);
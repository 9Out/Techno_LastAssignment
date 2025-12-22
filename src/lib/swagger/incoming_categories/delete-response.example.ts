import Joi from "joi";

export const deleteIncomeCategoryResponseExample = {
  success: true,
  message: "Income category deleted successfully",
  data: {
    id: "b0d90b92-7918-4fe7-8fd3-da12a3258a0f",
    code: "gaji_bulanan",
    name: "Gaji Bulanan",
    description: "Ini deskripsi beda",
    createdAt: "2025-12-05T14:09:21.586Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: "2025-12-05T15:05:13.393Z",
    updatedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    deletedAt: "2025-12-05T15:33:56.354Z",
    deletedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1"
  }
};

export const deleteIncomeCategoryResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("", null),

    createdAt: Joi.date().required(),
    createdBy: Joi.string().uuid().required(),

    updatedAt: Joi.date().allow(null),
    updatedBy: Joi.string().uuid().allow(null),

    deletedAt: Joi.date().required(),
    deletedBy: Joi.string().uuid().required(),
  }).required(),
}).example(deleteIncomeCategoryResponseExample);
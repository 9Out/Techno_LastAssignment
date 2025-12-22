import Joi from "joi";

const updateIncomeBatchResponseExample = {
  success: true,
  message: "Income batch updated successfully",
  data: {
    id: "5c704de2-095e-435d-a154-fa198d892f54",
    categoryId: "042ef9c7-4cb2-4547-a7d7-9db404e3a4ce",
    incomeDate: "2025-12-07",
    totalAmount: "25000000.00",
    description: "Ini untuk yang makan satu satu per-tanggal 1 Mei",
    createdAt: "2025-12-07T16:01:19.401Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: "2025-12-07T16:49:33.401Z",
    updatedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    deletedAt: null,
    deletedBy: null
  }
};

export const updateIncomeBatchResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    categoryId: Joi.string().uuid().required(),
    incomeDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    totalAmount: Joi.string().required(),
    description: Joi.string().allow("", null),
    createdBy: Joi.string().uuid().required(),
    createdAt: Joi.date().required(),
    updatedBy: Joi.string().uuid().allow(null),
    updatedAt: Joi.date().allow(null),
    deletedAt: Joi.date().allow(null),
    deletedBy: Joi.string().uuid().allow(null),
  }).required(),
}).example(updateIncomeBatchResponseExample);
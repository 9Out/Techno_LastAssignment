import Joi from "joi";

export const deleteExpenseCategoryResponseExample = {
  success: true,
  message: "Expense category deleted successfully",
  data: {
    id: "79a710d0-5c7d-4087-a500-43b8e04ede24",
    code: "belanja_terbaru",
    name: "Belanja Terbaru",
    description: "Pembaruan belanja terbaru",
    createdAt: "2025-12-09T15:13:58.156Z",
    createdBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    updatedAt: "2025-12-09T15:15:31.272Z",
    updatedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    deletedAt: "2025-12-09T15:16:33.716Z",
    deletedBy: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1"
  }
};

export const deleteExpenseCategoryResponseSchema = Joi.object({
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
}).example(deleteExpenseCategoryResponseExample);
import Joi from "joi";

const getAllIncomeBatchesResponseExample = {
  success: true,
  message: "Income batches retrieved successfully",
  data: [
    {
      id: "5c704de2-095e-435d-a154-fa198d892f54",
      categoryId: "bbec0be8-8cc4-48b5-9af7-4d57e412629b",
      incomeDate: "2025-12-07",
      totalAmount: "12500000.00",
      description: "Ini untuk spp satu satu per-tanggal 7 Desember",
      createdAt: "2025-12-07T16:01:19.401Z",
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

export const getAllIncomeBatchesResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.array()
    .items(
      Joi.object({
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
      })
    )
    .required(),
  meta: Joi.object({
    total: Joi.number().required(),
    page: Joi.number().required(),
    perPage: Joi.number().required(),
    totalPages: Joi.number().required(),
  }).required(),
}).example(getAllIncomeBatchesResponseExample);
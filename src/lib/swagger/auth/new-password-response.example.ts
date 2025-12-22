// /lib/swagger/auth/new-password-response.schema.ts
import Joi from "joi";

const newPasswordResponseExample = {
  success: "true",
  message: "Password berhasil diubah",
  data: {
    id: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    username: "admin",
    fullName: "Admin Ganteng",
    email: "admin@example.com",
    role: "superadmin",
    active: true,
  },
};

export const newPasswordResponseSchema = Joi.object({
  success: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    fullName: Joi.string().allow(null).required(),
    email: Joi.string().required(),
    active: Joi.boolean().required(),
  }),
}).label("NewPasswordResponse").example(newPasswordResponseExample);
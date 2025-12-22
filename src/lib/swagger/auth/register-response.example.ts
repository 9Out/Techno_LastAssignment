// /lib/swagger/auth/register-response.schema.ts
import Joi from "joi";

const registerResponseExample = {
  success: "true",
  message: "Registration successful",
  data: {
    id: "9f2c8c34-0c6f-4bd1-9b2c-4ddf6b5c59c1",
    username: "username",
    fullName: "user full name",
    email: "user@example.com",
    active: true,
  },
};

export const registerResponseSchema = Joi.object({
  success: Joi.string().required(),
  message: Joi.string().required(),
  data: Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    fullName: Joi.string().allow(null).required(),
    email: Joi.string().required(),
    active: Joi.boolean().required(),
  }).allow(null),
}).label("RegisterResponse").example(registerResponseExample);
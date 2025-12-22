// /lib/swagger/auth/login-response.example.ts
import Joi from "joi";

const loginResponseExample = {
  success: true,
  message: "Login berhasil",
  data: {
    token:
      "eyJhbGciOiJI......",
    user: {
      id: "851a86c5-f8c4-48cf-8824-a5132593c6e8",
      username: "username",
      fullName: "user full name",
      email: "user@mail.com",
    },
  },
};

export const loginResponseSchema = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
  data: Joi.object({
    token: Joi.string().required(),
    user: Joi.object({
      id: Joi.string().uuid().required(),
      username: Joi.string().required(),
      fullName: Joi.string().allow(null).required(),
      email: Joi.string().email().required(),
    }).required(),
  }).required(),
}).example(loginResponseExample);
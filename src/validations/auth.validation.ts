// validations/auth.validation.ts
import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().max(100).required().example("username123"),
  fullName: Joi.string().max(100).required().example("user full name"),
  email: Joi.string().email().required().example("user@example.com"),
  password: Joi.string().min(8).required().example("P@ssw0rd123 (minimal 8 karakter)"),
}).label("RegisterRequest");

export const loginSchema = Joi.object({
  identifier: Joi.string().required().example("superadmin@mail.com"),
  password: Joi.string().required().example("superadmin"),
}).label("LoginRequest");

export const newPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).required().example("P@ssw0rd123 (minimal 8 karakter)"),
}).label("NewPasswordRequest");
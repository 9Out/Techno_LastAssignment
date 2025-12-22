// routes/auth.routes.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import { authController } from "../controllers/auth.controller";
import { registerSchema, loginSchema, newPasswordSchema } from "../validations/auth.validation";
import { errorResponse } from "../utils/response.util";
import { registerResponseSchema } from "../lib/swagger/auth/register-response.example"; 
import { loginResponseSchema } from "../lib/swagger/auth/login-response.example"; 
import { newPasswordResponseSchema } from "../lib/swagger/auth/new-password-response.example"; 

export const authRoutes: ServerRoute[] = [
  // ---------------- REGISTER ----------------
  {
    method: "POST",
    path: "/auth/register",
    handler: authController.register,
    options: {
      auth: false,
      tags: ["api", "Auth"],
      description: "Registrasi akun baru",
      notes: "Membuat akun baru menggunakan email & password.",
      plugins: {
        "hapi-swagger": {
          security: [{ apiKey: [] }],
        },
      },
      validate: {
        payload: registerSchema,
        failAction: async (req, h, err: any) => {
          return errorResponse(h, err.message, 400, "VALIDATION_FAILED", true);
        },
      },
      response: {
        status: {
          201: registerResponseSchema, 
        },
      },
    },
  },

  // ---------------- LOGIN ----------------
  {
    method: "POST",
    path: "/auth/login",
    handler: authController.login,
    options: {
      auth: false,
      tags: ["api", "Auth"],
      description: "Login akun",
      notes: "Mengembalikan JWT token jika email & password valid.",
      plugins: {
        "hapi-swagger": {
          security: [{ apiKey: [] }],
        },
      },
      validate: {
        payload: loginSchema,
        failAction: (_, __, err) => {
          throw err;
        },
      },
      response: {
        status: {
          200: loginResponseSchema, 
        },
      },
    },
  },

  // ---------------- SET NEW PASSWORD ----------------
  {
    method: "POST",
    path: "/auth/new-password",
    handler: authController.setNewPassword,
    options: {
      tags: ["api", "Auth"],
      description: "Set password baru",
      plugins: {
        "hapi-swagger": {
          security: [{ apiKey: [], jwt: [] }],
        },
      },
      validate: {
        payload: newPasswordSchema,
        failAction: async (req, h, err: any) => {
          return errorResponse(h, err.message, 400, "VALIDATION_FAILED", true);
        },
      },
      response: {
        status: {
          200: newPasswordResponseSchema, 
        },
      },
    },
  },
];
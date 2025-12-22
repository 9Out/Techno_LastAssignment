/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";
import Joi from "joi";

const failAction = (_request: any, h: any, err: any) => {
  return h.response({ error: err.details[0].message }).code(400).takeover();
};

export const routes: ServerRoute[] = [
  // --------------------- HOMEPAGE ---------------------
  {
    method: "GET",
    path: "/",
    options: {
      tags: ['api', '0. Home'], // 1. Tag untuk mengelompokkan endpoint di Swagger UI
      description: 'Homepage / API Health Check',
      notes: 'Mengembalikan pesan sambutan untuk memastikan server berjalan normal.',
      auth: false,
      response: {
        status: {
          200: Joi.object({
            status: Joi.string().example('success'),
            message: Joi.string().example('Welcome to our Sistem My Uang APIs')
          }).label('HomeResponse')
        }
      }
    },
    handler: async (_request, h) => {
      const welcomeMessage = "Welcome to our Sistem My Uang APIs";
      return h
        .response({ status: "success", message: welcomeMessage })
        .code(200);
    },
  },
]
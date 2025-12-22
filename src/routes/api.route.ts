/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerRoute } from "@hapi/hapi";

const failAction = (_request: any, h: any, err: any) => {
  return h.response({ error: err.details[0].message }).code(400).takeover();
};

export const routes: ServerRoute[] = [
  // --------------------- HOMEPAGE ---------------------
  {
    method: "GET",
    path: "/",
    handler: async (_request, h) => {
      const welcomeMessage = "Welcome to our Sistem My Uang APIs";
      return h
        .response({ status: "success", message: welcomeMessage })
        .code(200);
    },
  },
]
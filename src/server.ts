// src/server.ts
import * as dotenv from "dotenv";
dotenv.config();

// require modules dam routes
import Hapi, { Request, ResponseToolkit } from "@hapi/hapi";
import { routes } from "./routes/api.route";
import { authRoutes } from "./routes/auth.route";
import { usersRoutes } from "./routes/users.route";
import { incomeBatchesRoutes } from "./routes/income-batches.route";
import { incomeCategoriesRoutes } from "./routes/income-categories.route";
import { expenseBatchesRoutes } from "./routes/expense-batches.routes";
import { expenseCategoriesRoutes } from "./routes/exspense-categories.route";
import { swaggerPlugin } from "./config/swagger";
import Joi from 'joi';

// plugins
import { authJwtPlugin } from "./plugins/authJWT";

export async function createServer() {
  const server = Hapi.server({
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["x-api-key", "content-type", "authorization"],
        additionalExposedHeaders: ["x-api-key"],
      },
    },
  });

  const VALID_API_KEY = process.env.KunciRumah;

  await server.register(swaggerPlugin);

  await server.register(authJwtPlugin);

  server.validator(Joi);

  server.route(routes);
  server.route(authRoutes);
  server.route(incomeBatchesRoutes);
  server.route(incomeCategoriesRoutes);
  server.route(expenseBatchesRoutes);
  server.route(expenseCategoriesRoutes);
  server.route(usersRoutes);

  server.ext("onRequest", (request: Request, h: ResponseToolkit) => {
    console.log(
      `Incoming request: ${request.method.toUpperCase()} ${request.path}`
    );

    const swaggerPaths = ['/docs', '/swagger.json', '/swaggerui'];
    if (request.method === 'options' || swaggerPaths.some(p => request.path.startsWith(p))) {
      return h.continue;
    }


    const apiKey = request.headers["x-api-key"];
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV !== "development"){
      if (!apiKey || apiKey !== VALID_API_KEY) {
        return h.response({ error: "Invalid API Key" }).code(403).takeover();
      }
    }

    return h.continue;
  });

  server.ext("onPreResponse", (request: Request, h: ResponseToolkit) => {
    const response = request.response;
    if ((response as any).isBoom) {
      console.log(response)
      console.error("Error occurred:", (response as any).output.payload);
    }
    return h.continue;
  });

  return server;
}
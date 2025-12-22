// src/server.ts
import * as dotenv from "dotenv";
dotenv.config();

// require modules dam routes
import Hapi, { Request, ResponseToolkit } from "@hapi/hapi";
import { routes } from "./routes/api.route";
import { authRoutes } from "./routes/auth.route";
import { incomeBatchesRoutes } from "./routes/income-batches.route";
import { incomeCategoriesRoutes } from "./routes/income-categories.route";
import { expenseBatchesRoutes } from "./routes/exspense-batches.route";
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

  server.route({
    method: 'GET',
    path: '/docs', // Anda bisa akses ini di browser nanti
    options: {
      auth: false,
      tags: ['api'], // Agar route ini tidak dianggap error
    },
    handler: (request, h) => {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>API Documentation</title>
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.css" />
            <style>
                html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
                *, *:before, *:after { box-sizing: inherit; }
                body { margin:0; background: #fafafa; }
            </style>
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-bundle.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui-standalone-preset.js"></script>
            <script>
                window.onload = function() {
                    // Load JSON dari endpoint yang dihasilkan swagger.ts
                    const ui = SwaggerUIBundle({
                        url: "/swagger.json", 
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [ SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset ],
                        layout: "StandaloneLayout",
                        // Mengurutkan Endpoint (GET/POST/dll) di dalam grup
                        // Pilihan: 'alpha' (abjad path), 'method' (HTTP method), atau function
                        operationsSorter: 'method', 

                        // Mengurutkan Grup/Tags (Nama Controller)
                        // Pilihan: 'alpha' (abjad A-Z)
                        tagsSorter: 'alpha',
                    });
                    window.ui = ui;
                };
            </script>
        </body>
        </html>
      `;
    }
  });

  server.validator(Joi);

  server.route(routes);
  server.route(authRoutes);
  server.route(incomeBatchesRoutes);
  server.route(incomeCategoriesRoutes);
  server.route(expenseBatchesRoutes);
  server.route(expenseCategoriesRoutes);

  server.ext("onRequest", (request: Request, h: ResponseToolkit) => {
    console.log(
      `Incoming request: ${request.method.toUpperCase()} ${request.path}`
    );

    const swaggerPaths = ['/docs', '/swagger.json'];
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
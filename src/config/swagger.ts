import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Pack from "../../package.json";

export const swaggerPlugin = {
  name: "swagger",
  version: "1.0.0",
  register: async (server: Hapi.Server) => {
    const swaggerOptions: HapiSwagger.RegisterOptions = {
      info: {
        title: "API Documentation",
        version: Pack.version,
      },
      grouping: "tags",
      definitionPrefix: "useLabel",
      documentationPath: "/docs",
      securityDefinitions: {
        // apiKey: {
        //   type: "apiKey",
        //   name: "x-api-key",
        //   in: "header",
        // },
        jwt: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
      security: [{ apiKey: [], jwt: [] }],
    };

    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
      {
        plugin: Inert,
      },
      {
        plugin: Vision,
      },
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ];

    await server.register(plugins);
  },
};
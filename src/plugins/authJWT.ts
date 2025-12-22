// plugins/authJWT.ts
import { Server } from "@hapi/hapi";
import jwt from "hapi-auth-jwt2";

/**
 * Plugin autentikasi JWT untuk Hapi.js.
 *
 * Plugin ini:
 * - Mendaftarkan "hapi-auth-jwt2" sebagai provider autentikasi.
 * - Membuat strategy bernama "jwt" dengan algoritma HS512.
 * - Mengatur strategy "jwt" sebagai default untuk semua route.
 * - Memberikan payload JWT yang telah didecode pada "request.auth.credentials".
 *
 * Cara penggunaan:
 * - Semua route otomatis terproteksi, kecuali diberi `options.auth = false`.
 * - Untuk akses credentials: `request.auth.credentials`.
 */
export const authJwtPlugin = {
  name: "auth-jwt",
  version: "1.0.0",

  /**
   * Registrasi plugin ke dalam server Hapi.
   * @param {Server} server - Instance server Hapi.
   */
  register: async (server: Server) => {
    await server.register(jwt);

    server.auth.strategy("jwt", "jwt", {
      key: process.env.JWT_SECRET,

      /**
       * Validasi payload JWT setelah diverifikasi.
       *
       * @param {Record<string, any>} decoded - Payload token yang sudah didecode.
       * @param {*} request - Request Hapi.
       * @param {*} h - Response toolkit.
       * @returns {Promise<{isValid: boolean, credentials: any}>}
       */
      validate: async (decoded, request, h) => {
        return {
          isValid: true,
          credentials: decoded,
        };
      },

      verifyOptions: { algorithms: ["HS512"] },
    });

    // Set JWT sebagai authentication default
    server.auth.default("jwt");
  },
};
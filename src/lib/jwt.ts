// lib/jwt.ts
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is required");
}

const signOptions: SignOptions = {
  algorithm: "HS512", 
  expiresIn: "1d",
};

const resetOptions: SignOptions = {
  algorithm: "HS512", 
  expiresIn: "10m",
};

const verifyOptions: VerifyOptions = {
  algorithms: ["HS512"], 
};

export default {
  /**
   * Sign JWT payload menggunakan algoritma HS512
   * dan durasi kedaluwarsa default 1 hari.
   *
   * @template T - Tipe payload JWT
   * @param {T} payload - Data yang akan disisipkan ke token
   * @returns {string} Token JWT yang sudah ditandatangani
   */
  sign<T extends object>(payload: T) {
    return jwt.sign(payload, secret, signOptions);
  },

  /**
   * Sign JWT payload menggunakan algoritma HS512
   * dan durasi kedaluwarsa default 10 menit.
   * (Ini khusus untuk akses reset password dengan OTP)
   *
   * @template T - Tipe payload JWT
   * @param {T} payload - Data yang akan disisipkan ke token
   * @returns {string} Token JWT yang sudah ditandatangani
   */
  signReset<T extends object>(payload: T) {
    return jwt.sign(payload, secret, resetOptions);
  },

  /**
   * Verifikasi dan decode token JWT menggunakan HS512.
   *
   * @template T - Tipe hasil decode
   * @param {string} token - Token JWT dari header Authorization
   * @returns {T} Payload hasil decode JWT
   * @throws Akan melempar error jika token tidak valid atau kedaluwarsa
   */
  verifyToken<T = any>(token: string): T {
    return jwt.verify(token, secret, verifyOptions) as T;
  },
};
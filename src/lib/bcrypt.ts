// lib/bcrypt.ts
import bcrypt from "bcrypt";

/**
 * Utility helper untuk hashing dan verifikasi password menggunakan bcrypt.
 */
export default {
  /**
   * Membuat hash dari password plaintext.
   *
   * @param {string} password - Password dalam bentuk plaintext.
   * @returns {Promise<string>} Hash bcrypt yang telah dienkripsi.
   */
  hash(password: string) {
    return bcrypt.hash(password, 10);
  },

  /**
   * Membandingkan password plaintext dengan hash bcrypt.
   *
   * @param {string} password - Password asli yang ingin diverifikasi.
   * @param {string} hashed - Hash bcrypt yang tersimpan di database.
   * @returns {Promise<boolean>} Hasil perbandingan, `true` jika cocok.
   */
  compare(password: string, hashed: string) {
    return bcrypt.compare(password, hashed);
  },
};
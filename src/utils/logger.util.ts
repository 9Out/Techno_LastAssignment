/**
 * Mencatat aksi yang berhasil ke console.
 *
 * ✅ SUCCESS: <action>
 * → Data: <data> (jika disertakan)
 *
 * @param action - Nama aksi atau proses yang berhasil, misal "LOGIN_USER" atau "CREATE_INCOME_BATCH".
 * @param data - Data opsional yang ingin dicatat, misal hasil query, payload, atau objek pengguna.
 *
 * @example
 * logSuccess("CREATE_USER", { id: "123", username: "admin" });
 * // Output di console:
 * // ✅ SUCCESS: CREATE_USER
 * // → Data: { id: '123', username: 'admin' }
 *
 * logSuccess("FETCH_USERS");
 * // Output di console:
 * // ✅ SUCCESS: FETCH_USERS
 */
export const logSuccess = (action: string, data?: any) => {
  console.log(`✅ SUCCESS: ${action}`);
  if (data) console.log("→ Data:", data);
};

/**
 * Mencatat aksi yang gagal (error) ke console dengan informasi detail.
 *
 * ❌ ERROR: <action>
 * → Message: <error.message>
 * → Code: <error.code> (jika ada)
 * → Status: <error.status> (jika ada)
 * → Raw: <error> (jika bukan instance Error)
 *
 * @param action - Nama aksi atau proses yang gagal.
 * @param error - Objek error atau informasi error lain yang ingin dicatat.
 *
 * @example
 * logError("CREATE_USER", new Error("Database connection failed"));
 * // Output di console:
 * // ❌ ERROR: CREATE_USER
 * // → Message: Database connection failed
 *
 * logError("FETCH_USERS", { message: "Not found", code: "USER_NOT_FOUND" });
 * // Output di console:
 * // ❌ ERROR: FETCH_USERS
 * // → Message: Not found
 * // → Code: USER_NOT_FOUND
 */
export const logError = (action: string, error: any) => {
  console.error(`❌ ERROR: ${action}`);
  console.error("→ Message:", error.message);
  if (error.code) console.error("→ Code:", error.code);
  if (error.status) console.error("→ Status:", error.status);
  if (!(error instanceof Error)) console.error("→ Raw:", error);
};
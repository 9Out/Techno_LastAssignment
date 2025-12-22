/**
 * Interface untuk format response sukses API.
 *
 * @template T - Tipe data yang dikembalikan (misal objek pengguna, daftar item, dsb.)
 *
 * @property success - Menandakan request berhasil (true).
 * @property message - Pesan singkat mengenai hasil request.
 * @property data - Data opsional yang dikembalikan.
 * @property meta - Metadata opsional (misal pagination, total items, dsb.)
 */
export interface ISuccessResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>; 
}

/**
 * Interface untuk detail error API.
 *
 * @property message - Pesan error yang jelas.
 * @property status - Status HTTP dari error (misal 400, 401, 403, 500).
 * @property code - Kode error opsional (misal "USER_NOT_FOUND").
 */
export interface IErrorDetail {
  message: string;
  status: number;
  code?: string;
}

/**
 * Interface untuk format response error API.
 */
export interface IErrorResponse {
  error: IErrorDetail;
}

/**
 * Tipe gabungan untuk response API, bisa sukses atau error.
 *
 * @template T - Tipe data response sukses.
 */
export type ApiResponse<T = any> = ISuccessResponse<T> | IErrorResponse;
/**
 * Interface untuk hasil paginasi API.
 *
 * @template T - Tipe data item dalam array `data`.
 *
 * @property data - Array berisi data hasil query sesuai tipe T.
 * @property meta - Informasi meta terkait paginasi.
 * @property meta.total - Total item keseluruhan.
 * @property meta.page - Halaman saat ini.
 * @property meta.perPage - Jumlah item per halaman.
 * @property meta.totalPages - Total halaman yang tersedia.
 */
export interface IPaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
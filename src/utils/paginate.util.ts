import { IPaginatedResult } from "../types/responses/paginate";

/**
 * Wrap data dengan metadata pagination
 * @param data Array data
 * @param total Total items
 * @param page Halaman saat ini
 * @param perPage Jumlah item per halaman
 */
export const paginate = <T>(data: T[], total: number, page: number, perPage: number): IPaginatedResult<T> => {
  return {
    data,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};
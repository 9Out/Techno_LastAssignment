export interface IExpenseCategoryQuery {
  search?: string;
  code?: string;
  parentId?: string;

  fromDate?: Date;
  toDate?: Date;

  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";

  page?: number;
  perPage?: number;
}

export interface ICreateExpenseCategoryRequest {
  name: string;
  description?: string;
  createdBy: string;
}

export interface IUpdateExpenseCategoryRequest {
  name?: string;
  description?: string;
  updatedBy: string;
}

export interface ISoftDeleteExpenseCategoryRequest {
  userId: string;
}
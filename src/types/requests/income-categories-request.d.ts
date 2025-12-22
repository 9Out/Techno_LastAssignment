export interface IIncomeCategoryQuery {
  search?: string;
  code?: string;
  createdBy?: string;
  fromDate?: Date;
  toDate?: Date;  

  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
  
  page?: number;     
  perPage?: number;  
}

export interface ICreateIncomeCategoryRequest {
  // code: string;
  name: string;
  description?: string;
  createdBy: string; 
}

export interface IUpdateIncomeCategoryRequest {
  name?: string;
  // code?: string;
  description?: string;
  updatedBy: string; 
}

export interface ISoftDeleteIncomeCategoryRequest {
  userId: string; 
}
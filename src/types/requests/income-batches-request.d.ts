// ============================
// QUERY INTERFACE (findAll)
// ============================
export interface IIncomeBatchQuery {
  search?: string; // untuk description
  categoryId?: string;
  fromDate?: Date; 
  toDate?: Date;   

  sortBy?: "createdAt" | "totalAmount" | "incomeDate";
  sortOrder?: "asc" | "desc";
  
  page?: number;     
  perPage?: number;  
}

// ============================
// CREATE INTERFACE
// ============================
export interface ICreateIncomeBatchRequest {
  categoryId: string;
  incomeDate: string;
  totalAmount: string;
  description?: string;
  createdBy: string;
}

// ============================
// UPDATE INTERFACE
// ============================
export interface IUpdateIncomeBatchRequest {
  categoryId?: string;
  incomeDate?: string; // YYYY-MM-DD
  totalAmount?: string;
  description?: string;
  updatedBy: string;
}

// ============================
// SOFT DELETE INTERFACE
// ============================
export interface ISoftDeleteIncomeBatchRequest {
  userId: string;
}
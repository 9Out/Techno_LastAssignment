// file: types/requests/expense-batches-request.ts

// ============================
// QUERY INTERFACE (findAll)
// ============================
export interface IExpenseBatchQuery {
  // Filter
  search?: string; // untuk description/vendorName
  categoryId?: string;
  fromDate?: Date; // rentang priode expenseDate
  toDate?: Date;   // rentang priode expenseDate
  
  // Sorting
  sortBy?: "createdAt" | "totalAmount" | "vendorName" | "expenseDate";
  sortOrder?: "asc" | "desc";
  
  // Pagination
  page?: number;     
  perPage?: number;  
}

// ============================
// CREATE INTERFACE
// Mengikuti skema tabel expenseBatches
// ============================
export interface ICreateExpenseBatchRequest {
  // Field Wajib/Utama
  categoryId: string; // Foreign Key (FK) ke expenseCategories
  expenseDate: string; // YYYY-MM-DD
  totalAmount: string; // Nominal total (decimal)
  
  description?: string;  // Deskripsi pengeluaran (text)

  // Audit
  createdBy: string; // User yang membuat record
}

// ============================
// UPDATE INTERFACE
// ============================
export interface IUpdateExpenseBatchRequest {
  // Field yang bisa diupdate (semua opsional kecuali updatedBy)
  categoryId?: string;
  expenseDate?: string; // YYYY-MM-DD
  totalAmount?: string;
  
  description?: string | null;

  // Audit
  updatedBy: string; // User yang memperbarui record
}

// ============================
// SOFT DELETE INTERFACE
// ============================
export interface ISoftDeleteExpenseBatchRequest {
  userId: string; // Digunakan untuk mengisi deletedBy
}
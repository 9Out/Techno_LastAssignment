// ============================
// REGISTER INTERFACE
// ============================
export interface IRegisterRequest {
  username: string;
  fullName?: string;
  email: string;
  password: string;

  createdBy?: string; // diisi dari auth credentials
}

// ============================
// LOGIN INTERFACE
// ============================
export interface ILoginRequest {
  identifier: string; // username atau email
  password: string;
}

// ============================
// SET NEW PASSWORD
// ============================
export interface INewPasswordRequest {
  newPassword: string;
  email: string;

  updatedBy?: string; // user id dari JWT
}
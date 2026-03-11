export type UserRole = 'USER' | 'ADMIN';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

export interface ContentResponse {
  message: string;
  access: string;
  role?: string;
}

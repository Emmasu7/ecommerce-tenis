export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  birthDate: string; // ISO date "YYYY-MM-DD"
  country: string;
  state: string;
  city: string;
  phone: string;
  address: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: 'Client' | 'Admin';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

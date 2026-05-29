export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roles: string[];
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}
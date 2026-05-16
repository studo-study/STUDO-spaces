export interface RegisterUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

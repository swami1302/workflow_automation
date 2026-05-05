export interface User {
  id: string;
  email: string;
  name: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}

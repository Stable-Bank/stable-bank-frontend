// API Response Types
export interface ApiResponse<T = any> {
  status: string;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: number | string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

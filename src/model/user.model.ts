export interface UserResponse {
  success: boolean;
  message?: string;
  data?: object;
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: {
    code: string;
    messsage: string;
  };
}

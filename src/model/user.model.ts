export interface UserResponse {
  success: boolean;
  message?: string;
  data?: object;
  error?: {
    code: string;
    messsage: string;
  };
}

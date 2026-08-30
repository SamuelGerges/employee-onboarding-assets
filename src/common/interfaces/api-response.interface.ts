export interface ApiResponse<T> {
  success: boolean;
  statusCode: any;
  message: string;
  data: T | null;
  timestamp: string;
}
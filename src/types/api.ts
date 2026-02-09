export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;       // Digunakan oleh is200ResponseWithData
  reason?: string; // Digunakan oleh is500Response & is401Response
}
import api from '@/utils/api';
import { ApiResponse } from '@/types/api';
import axios from 'axios';

export const authService = {
  register: async (payload: Record<string, unknown>): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('register', payload);
      return response.data;
    } catch (error: unknown) {
      // Menangani error Axios tanpa 'any'
      if (axios.isAxiosError(error)) {
        throw (error.response?.data as ApiResponse) || { message: 'Gagal menghubungi server' };
      }
      throw { message: 'Terjadi kesalahan sistem yang tidak diketahui' };
    }
  },
};
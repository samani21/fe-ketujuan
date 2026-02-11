import api from '@/utils/api';
import { ApiResponse } from '@/types/api';

export interface Outlet {
  id: number;
  name: string;
  address: string;
  telp: string;
  is_open: boolean;
  open_until: string;
  latitude: number | null;  
  longitude: number | null; 
}
export interface StoreData {
  id: number;
  name: string;
  logo: string | null;
  business_fields: string | null;
  address: string | null;
  telp: string;
  outlets: Outlet[];
}

export const storeService = {
  getStoreInfo: async (lat?: number, lng?: number): Promise<ApiResponse<StoreData>> => {
    // Tambahkan lat & lng ke query params jika ada
    const params = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
    const response = await api.get<ApiResponse<StoreData>>(`/v1/front/store-info${params}`);
    return response.data;
  },
  // API Ringan untuk halaman non-katalog
  getBasicInfo: async (): Promise<ApiResponse<Partial<StoreData>>> => {
    const response = await api.get('/v1/front/basic-info');
    return response.data;
  },

  // Simpan Pesan ke Database
  sendMessage: async (formData: { name: string; email: string; message: string }): Promise<ApiResponse> => {
    const response = await api.post('/v1/front/messages', formData);
    return response.data;
  },
};
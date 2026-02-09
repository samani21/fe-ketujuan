import axios from 'axios';
import { appConfig } from '@/config/appConfig';

const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname; // Contoh: dapur-mbm.localhost

    // Logika sakti: Hapus domain utama, sisanya adalah subdomain
    let subdomain = host
      .replace(appConfig.appDomain, '') // Hapus 'localhost' atau 'katujuan.net'
      .replace('www.', '')
      .replace(/^\.|\.$/g, ""); // Hapus titik di awal atau akhir

    // Jika kosong atau 'localhost', anggap sebagai platform level
    if (!subdomain || subdomain === 'localhost') {
      subdomain = 'app';
    }

    config.headers['X-Client-Subdomain'] = subdomain;
  }
  return config;
});

export default api;
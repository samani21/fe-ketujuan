import axios from 'axios';
import { appConfig } from '@/config/appConfig';
import { getToken } from './apiWithToken';

const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const token = getToken();

    let subdomain = host
      .replace(appConfig.appDomain, '')
      .replace('www.', '')
      .replace(/^\.|\.$/g, '');

    // default platform
    if (!subdomain || subdomain === 'localhost') {
      subdomain = 'app';
    }

    config.headers['X-Client-Subdomain'] = subdomain;

    // 🔐 Redirect jika app tapi belum login
    if (subdomain === 'app' && !token) {
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/register';
      }
      return Promise.reject(new axios.Cancel('No token'));
    }

    // pasang token jika ada
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
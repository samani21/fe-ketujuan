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

const getSubdomain = () => {
  if (typeof window === 'undefined') return 'app';

  const host = window.location.hostname;
  const parts = host.split('.');

  // localhost
  if (host.includes('localhost')) {
    if (parts.length === 1) return 'app';
    return parts[0];
  }

  // production
  if (parts.length <= 2) return 'app';

  return parts[0];
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const subdomain = getSubdomain();
    const token = getToken();

    // redirect jika platform app tapi belum login
    if (subdomain === 'app' && !token) {
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
        return Promise.reject(new axios.Cancel('No token'));
      }
    }

    config.headers['X-Client-Subdomain'] = subdomain;
  }

  return config;
});

export default api;
// utils/apiClient.ts (Kode sudah benar)

import { appConfig } from "@/config/appConfig";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const getToken = () => {
    try {
        if (typeof window !== "undefined") {
            const jsonValue = localStorage.getItem("token");
            return jsonValue ? jsonValue : null;
        }
        return null;
    } catch (e) {
        console.error("Error parsing token:", e);
        return null;
    }
};

// Buat instance axios dengan baseURL
export const apiClient: AxiosInstance = axios.create({
    baseURL: appConfig?.apiUrl,
    // Content-Type: undefined sudah benar untuk upload file (multipart/form-data)
    // dan JSON. Axios akan menangani secara otomatis.
    headers: {
        'Content-Type': undefined,
    },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export async function Get<T>(path: string): Promise<T> {
    const token = getToken();
    try {
        const response = await apiClient.get<T>(path);
        return response.data;
    } catch (error: any) {
        // Jika token tidak ada, auto logout
        // if (!token) {
        //     window.location.href = '/auth/login';
        //     return Promise.reject(error);
        // }
        if (error.response?.data?.message === 'Token has expired') {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("client");

            window.location.href = 'http://app.katujuan.net/';
        }
        // Kembalikan langsung error Axios tanpa mengubah jadi Error runtime
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}

export async function Post<T, D>(
    path: string,
    data: D,
    config?: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await apiClient.post<T>(path, data, config);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}

export async function Put<T, D>(path: string, data: D): Promise<T> {
    try {
        const response = await apiClient.put<T>(path, data);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}

export async function Delete<T = any>(path: string): Promise<T> {
    try {
        const response = await apiClient.delete<T>(path);
        return response.data;
    } catch (error: any) {
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}
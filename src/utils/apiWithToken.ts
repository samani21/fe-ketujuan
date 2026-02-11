// utils/apiClient.ts (Kode sudah benar)

import { appConfig } from "@/config/appConfig";
import axios, { AxiosInstance } from "axios";

const getToken = () => {
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
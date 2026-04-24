import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "./env";

const API_BASE_URL = `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/${env.NEXT_PUBLIC_API_VERSION}`;

/* Axios client with interceptors and typed helper methods for API requests */

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');

    if (status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized request");
    }

    // Log timeout errors for debugging
    if (isTimeout) {
      console.error('API Request Timeout:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        message: error.message,
      });
    }

    const message =
      (error.response?.data as { message?: string })?.message ||
      (isTimeout ? "Request timed out. Please try again." : error.message) ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
      isTimeout,
    });
  }
);

export const api = {
  get: async <T>(url: string, config = {}) => {
    const res = await apiClient.get<T>(url, config);
    return res.data;
  },
  post: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await apiClient.post<T>(url, data, config);
    return res.data;
  },
  put: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await apiClient.put<T>(url, data, config);
    return res.data;
  },
  patch: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await apiClient.patch<T>(url, data, config);
    return res.data;
  },
  delete: async <T>(url: string, config = {}) => {
    const res = await apiClient.delete<T>(url, config);
    return res.data;
  },
};

export default apiClient;

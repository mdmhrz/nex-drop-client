import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const AUTH_BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

/* Axios client specifically for auth APIs with cookie management */

const authClient: AxiosInstance = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/v1/auth`,
  timeout: 120000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');

    if (status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized request");
    }

    // Log timeout errors for debugging
    if (isTimeout) {
      console.error('Auth API Request Timeout:', {
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

export const authApi = {
  get: async <T>(url: string, config = {}) => {
    const res = await authClient.get<T>(url, config);
    return res.data;
  },
  post: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await authClient.post<T>(url, data, config);
    return res.data;
  },
};

export default authClient;

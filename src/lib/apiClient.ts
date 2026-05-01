import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "./env";

// Use frontend URL to go through Next.js rewrites (same-origin, cookies work)
const API_BASE_URL = `${env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/${env.NEXT_PUBLIC_API_VERSION}`;

/* Axios client with interceptors and typed helper methods for API requests */

// ── Reactive refresh state ─────────────────────────────────────────────────
type QueueEntry = { resolve: () => void; reject: (err: unknown) => void };
let isRefreshing = false;
const failedQueue: QueueEntry[] = [];

function processQueue(error: unknown): void {
  failedQueue.splice(0).forEach((entry) => {
    if (error) entry.reject(error);
    else entry.resolve();
  });
}
// ──────────────────────────────────────────────────────────────────────────

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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
  async (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
    const originalConfig = error.config as RetryConfig | undefined;

    // ── Reactive token refresh on 401 ──────────────────────────────────────
    if (
      status === 401 &&
      typeof window !== "undefined" &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url?.includes("/auth/refresh-token")
    ) {
      originalConfig._retry = true;

      if (isRefreshing) {
        // Another refresh is in flight — queue this request
        return new Promise<unknown>((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalConfig)),
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        await axios.post(
          `${env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/${env.NEXT_PUBLIC_API_VERSION}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return apiClient(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear httpOnly cookies (JS can't do this directly) then redirect
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => { });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // ──────────────────────────────────────────────────────────────────────

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

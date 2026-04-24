import { api } from "@/lib/apiClient";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN" | "RIDER" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/register", data);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", data);
  },

  getMe: async (): Promise<{ success: boolean; message: string; data: User }> => {
    return api.get("/auth/me");
  },

  refreshToken: async (): Promise<{
    success: boolean;
    message: string;
    data: { accessToken: string; refreshToken: string; sessionToken: string };
  }> => {
    return api.post("/auth/refresh-token");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string; data: { token: string; accessToken: string; refreshToken: string } }> => {
    return api.post("/auth/change-password", data);
  },

  logout: async (): Promise<{ success: boolean; message: string; data: { success: boolean } }> => {
    return api.post("/auth/logout");
  },

  verifyEmail: async (data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
    return api.post("/auth/verify-email", data);
  },

  forgetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    return api.post("/auth/forget-password", { email });
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return api.post("/auth/reset-password", data);
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    return api.post("/auth/resend-otp", { email });
  },
};

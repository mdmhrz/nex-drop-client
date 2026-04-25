import { authApi } from "@/lib/authClient";

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
    return authApi.post<AuthResponse>("/register", data);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return authApi.post<AuthResponse>("/login", data);
  },

  getMe: async (): Promise<{ success: boolean; message: string; data: User }> => {
    return authApi.get("/me");
  },

  refreshToken: async (): Promise<{
    success: boolean;
    message: string;
    data: { accessToken: string; refreshToken: string; sessionToken: string };
  }> => {
    return authApi.post("/refresh-token");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string; data: { token: string; accessToken: string; refreshToken: string } }> => {
    return authApi.post("/change-password", data);
  },

  logout: async (): Promise<{ success: boolean; message: string; data: { success: boolean } }> => {
    return authApi.post("/logout");
  },

  verifyEmail: async (data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
    return authApi.post("/verify-email", data);
  },

  forgetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    return authApi.post("/forget-password", { email });
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return authApi.post("/reset-password", data);
  },

  resendOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
    return authApi.post("/resend-otp", { email });
  },
};

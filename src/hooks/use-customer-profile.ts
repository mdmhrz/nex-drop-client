import { useQuery } from "@tanstack/react-query";
import { authService, type User } from "@/services/auth.service";

export const CUSTOMER_PROFILE_KEY = ["customer-profile"];

export interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export function useCustomerProfile() {
  return useQuery({
    queryKey: CUSTOMER_PROFILE_KEY,
    queryFn: () => authService.getMe(),
    staleTime: Infinity, // Keep data stale until manually invalidated
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { toast } from "sonner";
import type {
  AdminUser,
  UsersMeta,
  UsersResponse,
  GetUsersParams,
  UserResponse,
  UpdateUserRoleParams,
  UpdateUserRoleResponse,
  UpdateUserStatusParams,
  UpdateUserStatusResponse,
} from "@/services/admin.server";

export const ADMIN_USERS_KEY = ["admin", "users"];

export type { AdminUser, UsersMeta, UsersResponse, GetUsersParams, UserResponse, UpdateUserRoleParams, UpdateUserRoleResponse, UpdateUserStatusParams, UpdateUserStatusResponse };

export function useAdminUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => api.get<UsersResponse>("/users", { params }),
    staleTime: 0, // Always refetch for admin data
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, id],
    queryFn: () => api.get<UserResponse>(`/users/${id}`),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateUserRoleParams }) =>
      api.patch<UpdateUserRoleResponse>(`/users/${id}/role`, params),
    onSuccess: (response) => {
      toast.success(response.message || "User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to update user role";
      toast.error(errorMessage);
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateUserStatusParams }) =>
      api.patch<UpdateUserStatusResponse>(`/users/${id}/status`, params),
    onSuccess: (response) => {
      toast.success(response.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to update user status";
      toast.error(errorMessage);
    },
  });
}

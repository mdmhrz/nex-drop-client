import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { toast } from "sonner";
import type {
  AdminCashout,
  AdminCashoutsMeta,
  AdminCashoutsResponse,
  GetAdminCashoutsParams,
  UpdateCashoutStatusParams,
  UpdateCashoutStatusResponse,
} from "@/services/admin.server";

export const ADMIN_CASHOUTS_KEY = ["admin", "cashouts"];

export type { AdminCashout, AdminCashoutsMeta, AdminCashoutsResponse, GetAdminCashoutsParams, UpdateCashoutStatusParams, UpdateCashoutStatusResponse };

export function useAdminCashouts(params: GetAdminCashoutsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_CASHOUTS_KEY, params],
    queryFn: () => api.get<AdminCashoutsResponse>("/rider/cashouts", { params }),
    staleTime: 0,
  });
}

export function useUpdateCashoutStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateCashoutStatusParams }) =>
      api.patch<UpdateCashoutStatusResponse>(`/rider/cashouts/${id}`, params),
    onSuccess: (response) => {
      toast.success(response.message || "Cashout status updated successfully");
      queryClient.invalidateQueries({ queryKey: ADMIN_CASHOUTS_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to update cashout status";
      toast.error(errorMessage);
    },
  });
}

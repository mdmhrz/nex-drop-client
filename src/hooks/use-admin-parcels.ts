import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { toast } from "sonner";
import type {
  AdminParcel,
  AdminParcelsMeta,
  AdminParcelsResponse,
  GetAdminParcelsParams,
  AssignRiderParams,
  AssignRiderResponse,
  UpdateParcelStatusParams,
  UpdateParcelStatusResponse,
} from "@/services/admin.server";

export const ADMIN_PARCELS_KEY = ["admin", "parcels"];

export type { AdminParcel, AdminParcelsMeta, AdminParcelsResponse, GetAdminParcelsParams, AssignRiderParams, AssignRiderResponse, UpdateParcelStatusParams, UpdateParcelStatusResponse };

export function useAdminParcels(params: GetAdminParcelsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_PARCELS_KEY, params],
    queryFn: () => api.get<AdminParcelsResponse>("/parcels", { params }),
    staleTime: 0,
  });
}

export function useAssignRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: AssignRiderParams }) =>
      api.patch<AssignRiderResponse>(`/parcels/${id}/assign-rider`, params),
    onSuccess: (response) => {
      toast.success(response.message || "Rider assigned successfully");
      queryClient.invalidateQueries({ queryKey: ADMIN_PARCELS_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to assign rider";
      toast.error(errorMessage);
    },
  });
}

export function useUpdateParcelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateParcelStatusParams }) =>
      api.patch<UpdateParcelStatusResponse>(`/parcels/${id}/status`, params),
    onSuccess: (response) => {
      toast.success(response.message || "Parcel status updated successfully");
      queryClient.invalidateQueries({ queryKey: ADMIN_PARCELS_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to update parcel status";
      toast.error(errorMessage);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { toast } from "sonner";
import type {
  Parcel,
  ParcelsMeta,
  ParcelsResponse,
  GetParcelsParams,
  CancelParcelParams,
  CancelParcelResponse,
  InitiatePaymentParams,
  InitiatePaymentResponse,
  PaymentMethod,
} from "@/services/user.server";

export const PARCELS_KEY = ["parcels"];

export type { Parcel, ParcelsMeta, ParcelsResponse, GetParcelsParams, CancelParcelParams, CancelParcelResponse, InitiatePaymentParams, InitiatePaymentResponse, PaymentMethod };

export function useParcels(params: GetParcelsParams = {}) {
  return useQuery({
    queryKey: [...PARCELS_KEY, params],
    queryFn: () => api.get<ParcelsResponse>("/parcels/my", { params }),
    staleTime: Infinity,
  });
}

export function useCancelParcel(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: CancelParcelParams }) =>
      api.patch<CancelParcelResponse>(`/parcels/${id}/cancel`, params),
    onSuccess: (response) => {
      toast.success(response.message || "Parcel cancelled successfully");
      queryClient.invalidateQueries({ queryKey: PARCELS_KEY });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to cancel parcel";
      toast.error(errorMessage);
    },
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: InitiatePaymentParams }) =>
      api.post<InitiatePaymentResponse>(`/parcels/${id}/payment`, params),
    onSuccess: (response) => {
      toast.success(response.message || "Payment initiated successfully");
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to initiate payment";
      toast.error(errorMessage);
    },
  });
}

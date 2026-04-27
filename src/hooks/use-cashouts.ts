import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type {
    Cashout,
    CashoutsMeta,
    CashoutsResponse,
    GetCashoutsParams,
    CashoutRequestResponse,
} from "@/services/rider.server";

export const CASHOUTS_KEY = ["cashouts"];

export type { Cashout, CashoutsMeta, CashoutsResponse, GetCashoutsParams };

export function useCashouts(params: GetCashoutsParams = {}) {
    return useQuery({
        queryKey: [...CASHOUTS_KEY, params],
        queryFn: () => api.get<CashoutsResponse>("/rider/cashouts/me", { params }),
        staleTime: Infinity,
    });
}

export function useCashoutRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) =>
            api.post<CashoutRequestResponse>("/rider/cashouts/request", { amount }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CASHOUTS_KEY });
        },
    });
}

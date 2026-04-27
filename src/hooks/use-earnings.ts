import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";

export const EARNINGS_KEY = ["earnings"];

export interface EarningParcel {
    id: string;
    trackingId: string;
    price: number;
    customer: {
        id: string;
        name: string;
        email: string;
    };
}

export interface Earning {
    id: string;
    riderId: string;
    parcelId: string;
    amount: number;
    percentage: number;
    status: "PENDING" | "PAID";
    createdAt: string;
    parcel: EarningParcel;
}

export interface EarningsMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount: number;
}

export interface EarningsResponse {
    success: boolean;
    message: string;
    data: Earning[];
    meta: EarningsMeta;
}

export interface GetEarningsParams {
    page?: number;
    limit?: number;
    status?: "PENDING" | "PAID" | "ALL";
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export function useEarnings(params: GetEarningsParams = {}) {
    return useQuery({
        queryKey: [...EARNINGS_KEY, params],
        queryFn: () => api.get<EarningsResponse>("/rider/earnings/history", { params }),
        staleTime: Infinity,
    });
}

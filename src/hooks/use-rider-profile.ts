import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";

export const RIDER_PROFILE_KEY = ["rider-profile"];

export interface RiderUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: "RIDER";
    status: "ACTIVE" | "BLOCKED" | "DELETED";
}

export interface RiderProfile {
    id: string;
    userId: string;
    district: string;
    accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
    currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
    rating: number;
    totalDeliveries: number;
    createdAt: string;
    updatedAt: string;
    user: RiderUser;
}

export interface RiderProfileResponse {
    success: boolean;
    message: string;
    data: RiderProfile;
}

export function useRiderProfile() {
    return useQuery({
        queryKey: RIDER_PROFILE_KEY,
        queryFn: () => api.get<RiderProfileResponse>("/rider/me"),
        staleTime: Infinity, // Keep data stale until manually invalidated
        retry: false,
    });
}

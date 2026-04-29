import { api } from "@/lib/apiClient";

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
}

export interface RiderUser {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER";
    status: "ACTIVE";
}

export interface ApplyAsRiderAuthResponse {
    success: boolean;
    message: string;
    data: {
        rider: RiderProfile;
    };
}

export interface ApplyAsRiderUnauthResponse {
    success: boolean;
    message: string;
    data: {
        user: RiderUser;
        rider: RiderProfile;
    };
}

export interface ApplyAsRiderAuthData {
    district: string;
}

export interface ApplyAsRiderUnauthData {
    name: string;
    email: string;
    password: string;
    phone: string;
    district: string;
}

export const riderService = {
    applyAsRider: async (
        data: ApplyAsRiderAuthData
    ): Promise<ApplyAsRiderAuthResponse> => {
        return api.post<ApplyAsRiderAuthResponse>("/rider/apply", data);
    },

    applyAsRiderUnauth: async (
        data: ApplyAsRiderUnauthData
    ): Promise<ApplyAsRiderUnauthResponse> => {
        return api.post<ApplyAsRiderUnauthResponse>("/rider/apply", data);
    },
};

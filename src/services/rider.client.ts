import { api } from "@/lib/apiClient";

export interface UpdateStatusParams {
    currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
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
}

export interface UpdateStatusResponse {
    success: boolean;
    message: string;
    data: RiderProfile;
}

export async function updateRiderStatus(params: UpdateStatusParams): Promise<UpdateStatusResponse> {
    return api.patch<UpdateStatusResponse>("/rider/status", params);
}

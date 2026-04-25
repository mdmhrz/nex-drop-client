import { api } from "@/lib/apiClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParcelCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export type ParcelStatus =
    | "REQUESTED"
    | "ASSIGNED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CANCELLED";

export interface Parcel {
    id: string;
    trackingId: string;
    customerId: string;
    riderId: string | null;
    pickupAddress: string;
    deliveryAddress: string;
    districtFrom: string;
    districtTo: string;
    status: ParcelStatus;
    price: number;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    customer: ParcelCustomer;
}

export interface ParcelsResponseMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ParcelsResponse {
    success: boolean;
    message: string;
    data: Parcel[];
    meta: ParcelsResponseMeta;
}

export interface GetAvailableParcelsParams {
    page?: number;
    limit?: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const parcelService = {
    getAvailableParcels: (params: GetAvailableParcelsParams = {}): Promise<ParcelsResponse> => {
        const { page = 1, limit = 10 } = params;
        return api.get<ParcelsResponse>("/parcels/available", {
            params: { page, limit },
        });
    },
};

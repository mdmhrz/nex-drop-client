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

export interface GetAssignedParcelsParams {
    page?: number;
    limit?: number;
}

export interface AcceptParcelParams {
    note?: string;
}

export interface AcceptParcelResponse {
    success: boolean;
    message: string;
    data: Parcel;
}

export interface ParcelActionParams {
    note?: string;
}

export interface ParcelActionResponse {
    success: boolean;
    message: string;
    data: Parcel;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const parcelService = {
    getAvailableParcels: (params: GetAvailableParcelsParams = {}): Promise<ParcelsResponse> => {
        const { page = 1, limit = 10 } = params;
        return api.get<ParcelsResponse>("/parcels/available", {
            params: { page, limit },
        });
    },
    getAssignedParcels: (params: GetAssignedParcelsParams = {}): Promise<ParcelsResponse> => {
        const { page = 1, limit = 10 } = params;
        return api.get<ParcelsResponse>("/parcels/assigned", {
            params: { page, limit },
        });
    },
    acceptParcel: (id: string, params: AcceptParcelParams = {}): Promise<AcceptParcelResponse> => {
        return api.patch<AcceptParcelResponse>(`/parcels/${id}/accept`, params);
    },
    pickParcel: (id: string, params: ParcelActionParams = {}): Promise<ParcelActionResponse> => {
        return api.patch<ParcelActionResponse>(`/parcels/${id}/pick`, params);
    },
    deliverParcel: (id: string, params: ParcelActionParams = {}): Promise<ParcelActionResponse> => {
        return api.patch<ParcelActionResponse>(`/parcels/${id}/deliver`, params);
    },
};

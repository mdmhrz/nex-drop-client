import "server-only";
import { serverFetch } from "@/lib/serverFetch";

export type ParcelStatus = "REQUESTED" | "ASSIGNED" | "PICKED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface ParcelCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface ParcelRiderUser {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface ParcelRider {
    id: string;
    userId: string;
    district: string;
    accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
    currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
    user: ParcelRiderUser;
}

export interface ParcelStatusLogUser {
    id: string;
    name: string;
    email: string;
}

export interface ParcelStatusLog {
    id: string;
    parcelId: string;
    status: ParcelStatus;
    changedBy: string;
    note?: string | null;
    timestamp: string;
    user: ParcelStatusLogUser;
}

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
    rider?: ParcelRider | null;
    statusLogs?: ParcelStatusLog[];
}

export interface ParcelResponse {
    success: boolean;
    message: string;
    data: Parcel;
}

export async function getParcelById(id: string): Promise<ParcelResponse> {
    return serverFetch<ParcelResponse>(`/parcels/${id}`);
}

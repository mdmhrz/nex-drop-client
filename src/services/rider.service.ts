import { env } from "@/lib/env";
import { cookies } from "next/headers";

export interface RiderUser {
    id: string;
    name: string;
    email: string;
    role: "RIDER";
    status: "ACTIVE" | "BLOCKED" | "DELETED";
}

export interface RiderProfile {
    id: string;
    userId: string;
    district: string;
    accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
    currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE" | "ON_DELIVERY";
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

export async function getRiderProfile(): Promise<RiderProfileResponse> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${env.BACKEND_BASE_URL}/api/${env.API_VERSION}/rider/me`, {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch rider profile");
    }

    return response.json();
}

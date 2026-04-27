import "server-only";
import { serverFetch } from "@/lib/serverFetch";

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

export interface DashboardOverview {
    totalDeliveries: number;
    totalEarnings: number;
    availableEarnings: number;
    rating: number;
    totalRatings: number;
    avgDeliveryTime: number;
    todayDeliveries: number;
    thisWeekDeliveries: number;
    thisMonthDeliveries: number;
}

export interface BarChartData {
    date: string;
    earnings: number;
    deliveries: number;
}

export interface BarChart {
    title: string;
    data: BarChartData[];
}

export interface PieChartData {
    status: string;
    count: number;
}

export interface PieChart {
    title: string;
    data: PieChartData[];
}

export interface RiderDashboardData {
    overview: DashboardOverview;
    barChart: BarChart;
    pieChart: PieChart;
}

export interface RiderDashboardResponse {
    success: boolean;
    message: string;
    data: RiderDashboardData;
}

export async function getRiderProfile(): Promise<RiderProfileResponse> {
    return serverFetch<RiderProfileResponse>("/rider/me");
}

export async function getRiderDashboard(): Promise<RiderDashboardResponse> {
    return serverFetch<RiderDashboardResponse>("/rider/dashboard");
}

export interface Cashout {
    id: string;
    riderId: string;
    amount: number;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
    requestedAt: string;
    processedAt: string | null;
}

export interface CashoutsMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface CashoutsResponse {
    success: boolean;
    message: string;
    data: Cashout[];
    meta: CashoutsMeta;
}

export interface GetCashoutsParams {
    page?: number;
    limit?: number;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "PAID" | "ALL";
    startDate?: string;
    endDate?: string;
}

export async function getCashouts(params: GetCashoutsParams = {}): Promise<CashoutsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.status) searchParams.set("status", params.status);
    if (params.startDate) searchParams.set("startDate", params.startDate);
    if (params.endDate) searchParams.set("endDate", params.endDate);

    return serverFetch<CashoutsResponse>(`/rider/cashouts/me?${searchParams.toString()}`);
}

export interface CashoutRequest {
    id: string;
    riderId: string;
    amount: number;
    status: "PENDING";
    requestedAt: string;
    processedAt: null;
}

export interface CashoutRequestResponse {
    success: boolean;
    message: string;
    data: CashoutRequest;
}

export async function requestCashout(amount: number): Promise<CashoutRequestResponse> {
    return serverFetch<CashoutRequestResponse>("/rider/cashouts/request", {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
}

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

export async function getEarnings(params: GetEarningsParams = {}): Promise<EarningsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.status) searchParams.set("status", params.status);
    if (params.startDate) searchParams.set("startDate", params.startDate);
    if (params.endDate) searchParams.set("endDate", params.endDate);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    return serverFetch<EarningsResponse>(`/rider/earnings/history?${searchParams.toString()}`);
}

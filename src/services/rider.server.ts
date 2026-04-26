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

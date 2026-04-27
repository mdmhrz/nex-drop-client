import "server-only";
import { serverFetch } from "@/lib/serverFetch";

export interface DashboardOverview {
  totalParcels: number;
  totalSpent: number;
  activeParcels: number;
  deliveredParcels: number;
  avgDeliveryTime: number;
  todayParcels: number;
  thisWeekParcels: number;
  thisMonthParcels: number;
}

export interface BarChartData {
  date: string;
  spent: number;
  parcels: number;
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

export interface UserDashboardData {
  overview: DashboardOverview;
  barChart: BarChart;
  pieChart: PieChart;
}

export interface UserDashboardResponse {
  success: boolean;
  message: string;
  data: UserDashboardData;
}

export async function getUserDashboard(): Promise<UserDashboardResponse> {
  return serverFetch<UserDashboardResponse>("/users/dashboard");
}

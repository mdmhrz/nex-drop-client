import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type {
  AdminDashboardData,
  AdminDashboardResponse,
  RevenueAnalyticsData,
  RevenueAnalyticsResponse,
  GetRevenueAnalyticsParams,
} from "@/services/admin.server";

export const ADMIN_DASHBOARD_KEY = ["admin", "dashboard"];
export const ADMIN_REVENUE_ANALYTICS_KEY = ["admin", "revenue"];

export type { AdminDashboardData, AdminDashboardResponse, RevenueAnalyticsData, RevenueAnalyticsResponse, GetRevenueAnalyticsParams };

export function useAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: () => api.get<AdminDashboardResponse>("/analytics/dashboard"),
    staleTime: 0,
    refetchInterval: 60000, // Refetch every minute for dashboard data
  });
}

export function useAdminRevenueAnalytics(params: GetRevenueAnalyticsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_REVENUE_ANALYTICS_KEY, params],
    queryFn: () => api.get<RevenueAnalyticsResponse>("/analytics/revenue", { params }),
    staleTime: 0,
  });
}

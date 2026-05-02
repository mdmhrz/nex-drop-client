import { api } from "@/lib/apiClient";
import type {
  AdminDashboardResponse,
  RevenueAnalyticsResponse,
  GetRevenueAnalyticsParams,
  UsersResponse,
  GetUsersParams,
  UserResponse,
  UpdateUserRoleParams,
  UpdateUserRoleResponse,
  UpdateUserStatusParams,
  UpdateUserStatusResponse,
  AdminParcelsResponse,
  GetAdminParcelsParams,
  AssignRiderParams,
  AssignRiderResponse,
  UpdateParcelStatusParams,
  UpdateParcelStatusResponse,
  AdminCashoutsResponse,
  GetAdminCashoutsParams,
  UpdateCashoutStatusParams,
  UpdateCashoutStatusResponse,
  RiderApplicationsResponse,
  GetRiderApplicationsParams,
  UpdateRiderAccountStatusParams,
  UpdateRiderAccountStatusResponse,
} from "./admin.server";

// Re-export types from admin.server.ts for type consistency
export type {
  AdminDashboardOverview,
  AdminDashboardRevenue,
  AdminDashboardRiders,
  AdminDashboardPerformance,
  AdminDashboardFinancial,
  AdminDashboardGrowth,
  AdminDashboardData,
  AdminDashboardResponse,
  RevenueSummary,
  RevenueByPaymentMethod,
  RevenueByDistrict,
  RevenueOverTime,
  RevenueAnalyticsData,
  RevenueAnalyticsResponse,
  GetRevenueAnalyticsParams,
  UserRole,
  UserStatus,
  AdminUser,
  UsersMeta,
  UsersResponse,
  GetUsersParams,
  UserResponse,
  UpdateUserRoleParams,
  UpdateUserRoleResponse,
  UpdateUserStatusParams,
  UpdateUserStatusResponse,
  ParcelStatus,
  AdminParcelCustomer,
  AdminParcelRiderUser,
  AdminParcelRider,
  AdminParcel,
  AdminParcelsMeta,
  AdminParcelsResponse,
  GetAdminParcelsParams,
  AssignRiderParams,
  AssignRiderResponse,
  UpdateParcelStatusParams,
  UpdateParcelStatusResponse,
  CashoutStatus,
  AdminCashoutRiderUser,
  AdminCashoutRider,
  AdminCashout,
  AdminCashoutsMeta,
  AdminCashoutsResponse,
  GetAdminCashoutsParams,
  UpdateCashoutStatusParams,
  UpdateCashoutStatusResponse,
  RiderAccountStatus,
  RiderApplicationUser,
  RiderApplication,
  RiderApplicationsMeta,
  RiderApplicationsResponse,
  GetRiderApplicationsParams,
  UpdateRiderAccountStatusParams,
  UpdateRiderAccountStatusResponse,
} from "./admin.server";

// ==================== ANALYTICS ====================

export async function getAdminDashboardClient(): Promise<AdminDashboardResponse> {
  return api.get<AdminDashboardResponse>("/analytics/dashboard");
}

export async function getAdminRevenueAnalyticsClient(params: GetRevenueAnalyticsParams = {}): Promise<RevenueAnalyticsResponse> {
  return api.get<RevenueAnalyticsResponse>("/analytics/revenue", { params });
}

// ==================== USERS ====================

export async function getAllUsersClient(params: GetUsersParams = {}): Promise<UsersResponse> {
  return api.get<UsersResponse>("/users", { params });
}

export async function getUserByIdClient(id: string): Promise<UserResponse> {
  return api.get<UserResponse>(`/users/${id}`);
}

export async function updateUserRoleClient(id: string, params: UpdateUserRoleParams): Promise<UpdateUserRoleResponse> {
  return api.patch<UpdateUserRoleResponse>(`/users/${id}/role`, params);
}

export async function updateUserStatusClient(id: string, params: UpdateUserStatusParams): Promise<UpdateUserStatusResponse> {
  return api.patch<UpdateUserStatusResponse>(`/users/${id}/status`, params);
}

// ==================== PARCELS ====================

export async function getAllParcelsClient(params: GetAdminParcelsParams = {}): Promise<AdminParcelsResponse> {
  return api.get<AdminParcelsResponse>("/parcels", { params });
}

export async function getAvailableParcelsClient(params: { page?: number; limit?: number } = {}): Promise<AdminParcelsResponse> {
  return api.get<AdminParcelsResponse>("/parcels/available", { params });
}

export async function assignRiderToParcelClient(id: string, params: AssignRiderParams): Promise<AssignRiderResponse> {
  return api.patch<AssignRiderResponse>(`/parcels/${id}/assign-rider`, params);
}

export async function updateParcelStatusClient(id: string, params: UpdateParcelStatusParams): Promise<UpdateParcelStatusResponse> {
  return api.patch<UpdateParcelStatusResponse>(`/parcels/${id}/status`, params);
}

// ==================== CASHOUTS ====================

export async function getAllCashoutsClient(params: GetAdminCashoutsParams = {}): Promise<AdminCashoutsResponse> {
  return api.get<AdminCashoutsResponse>("/rider/cashouts", { params });
}

export async function updateCashoutStatusClient(id: string, params: UpdateCashoutStatusParams): Promise<UpdateCashoutStatusResponse> {
  return api.patch<UpdateCashoutStatusResponse>(`/rider/cashouts/${id}`, params);
}

// ==================== RIDER APPLICATIONS ====================

export async function getAllRiderApplicationsClient(params: GetRiderApplicationsParams = {}): Promise<RiderApplicationsResponse> {
  return api.get<RiderApplicationsResponse>("/rider/applications", { params });
}

export async function updateRiderAccountStatusClient(riderId: string, params: UpdateRiderAccountStatusParams): Promise<UpdateRiderAccountStatusResponse> {
  return api.patch<UpdateRiderAccountStatusResponse>(`/rider/applications/${riderId}/account-status`, params);
}


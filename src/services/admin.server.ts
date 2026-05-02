import "server-only";
import { serverFetch } from "@/lib/serverFetch";

// ==================== ANALYTICS ====================

export interface AdminDashboardOverview {
  totalParcels: number;
  totalPendingParcels: number;
  totalCompletedParcels: number;
  totalUsers: number;
  totalRiders: number;
  totalCustomers: number;
}

export interface AdminDashboardRevenue {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  platformRevenue: number;
  avgOrderValue: number;
}

export interface AdminDashboardRiders {
  totalRiders: number;
  activeRiders: number;
  onlineRiders: number;
}

export interface AdminDashboardPerformance {
  avgDeliveryTime: number;
  deliverySuccessRate: number;
}

export interface AdminDashboardFinancial {
  riderPayouts: number;
  pendingPayouts: number;
}

export interface AdminDashboardGrowth {
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface AdminDashboardData {
  overview: AdminDashboardOverview;
  revenue: AdminDashboardRevenue;
  riders: AdminDashboardRiders;
  performance: AdminDashboardPerformance;
  financial: AdminDashboardFinancial;
  growth: AdminDashboardGrowth;
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardData;
}

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return serverFetch<AdminDashboardResponse>("/analytics/dashboard");
}

export interface RevenueSummary {
  totalRevenue: number;
  totalPayments: number;
  averageOrderValue: number;
  currency: string;
}

export interface RevenueByPaymentMethod {
  paymentMethod: string;
  totalRevenue: number;
  paymentCount: number;
  percentage: number;
}

export interface RevenueByDistrict {
  district: string;
  totalRevenue: number;
  parcelCount: number;
  averageOrderValue: number;
}

export interface RevenueOverTime {
  date: string;
  revenue: number;
  paymentCount: number;
}

export interface RevenueAnalyticsData {
  summary: RevenueSummary;
  byPaymentMethod: RevenueByPaymentMethod[];
  byDistrict: RevenueByDistrict[];
  overTime: RevenueOverTime[];
}

export interface RevenueAnalyticsResponse {
  success: boolean;
  message: string;
  data: RevenueAnalyticsData;
}

export interface GetRevenueAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export async function getAdminRevenueAnalytics(params: GetRevenueAnalyticsParams = {}): Promise<RevenueAnalyticsResponse> {
  const searchParams = new URLSearchParams();
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);

  return serverFetch<RevenueAnalyticsResponse>(`/analytics/revenue?${searchParams.toString()}`);
}

// ==================== USERS ====================

export type UserRole = "CUSTOMER" | "ADMIN" | "RIDER" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  meta: UsersMeta;
}

export interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getAllUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<UsersResponse>(`/users?${searchParams.toString()}`);
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export async function getUserById(id: string): Promise<UserResponse> {
  return serverFetch<UserResponse>(`/users/${id}`);
}

export interface UpdateUserRoleParams {
  role: UserRole;
}

export interface UpdateUserRoleResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export async function updateUserRole(id: string, params: UpdateUserRoleParams): Promise<UpdateUserRoleResponse> {
  return serverFetch<UpdateUserRoleResponse>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export interface UpdateUserStatusParams {
  status: UserStatus;
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export async function updateUserStatus(id: string, params: UpdateUserStatusParams): Promise<UpdateUserStatusResponse> {
  return serverFetch<UpdateUserStatusResponse>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

// ==================== PARCELS ====================

export type ParcelStatus = "REQUESTED" | "ASSIGNED" | "PICKED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface AdminParcelCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AdminParcelRiderUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AdminParcelRider {
  id: string;
  userId: string;
  district: string;
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
  currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  user: AdminParcelRiderUser;
}

export interface AdminParcel {
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
  customer: AdminParcelCustomer;
  rider?: AdminParcelRider | null;
}

export interface AdminParcelsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminParcelsResponse {
  success: boolean;
  message: string;
  data: AdminParcel[];
  meta: AdminParcelsMeta;
}

export interface GetAdminParcelsParams {
  status?: ParcelStatus;
  district?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export async function getAllParcels(params: GetAdminParcelsParams = {}): Promise<AdminParcelsResponse> {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.district) searchParams.set("district", params.district);
  if (params.date) searchParams.set("date", params.date);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<AdminParcelsResponse>(`/parcels?${searchParams.toString()}`);
}

export async function getAvailableParcels(params: { page?: number; limit?: number } = {}): Promise<AdminParcelsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<AdminParcelsResponse>(`/parcels/available?${searchParams.toString()}`);
}

export interface AssignRiderParams {
  riderId: string;
  note?: string;
}

export interface AssignRiderResponse {
  success: boolean;
  message: string;
  data: AdminParcel;
}

export async function assignRiderToParcel(id: string, params: AssignRiderParams): Promise<AssignRiderResponse> {
  return serverFetch<AssignRiderResponse>(`/parcels/${id}/assign-rider`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export interface UpdateParcelStatusParams {
  status: ParcelStatus;
  note?: string;
}

export interface UpdateParcelStatusResponse {
  success: boolean;
  message: string;
  data: AdminParcel;
}

export async function updateParcelStatus(id: string, params: UpdateParcelStatusParams): Promise<UpdateParcelStatusResponse> {
  return serverFetch<UpdateParcelStatusResponse>(`/parcels/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

// ==================== CASHOUTS ====================

export type CashoutStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export interface AdminCashoutRiderUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminCashoutRider {
  id: string;
  userId: string;
  district: string;
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
  currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  user: AdminCashoutRiderUser;
}

export interface AdminCashout {
  id: string;
  riderId: string;
  amount: number;
  status: CashoutStatus;
  requestedAt: string;
  processedAt: string | null;
  rider: AdminCashoutRider;
}

export interface AdminCashoutsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminCashoutsResponse {
  success: boolean;
  message: string;
  data: AdminCashout[];
  meta: AdminCashoutsMeta;
}

export interface GetAdminCashoutsParams {
  status?: CashoutStatus | "ALL";
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getAllCashouts(params: GetAdminCashoutsParams = {}): Promise<AdminCashoutsResponse> {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set("status", params.status);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<AdminCashoutsResponse>(`/cashouts?${searchParams.toString()}`);
}

export interface UpdateCashoutStatusParams {
  status: CashoutStatus;
}

export interface UpdateCashoutStatusResponse {
  success: boolean;
  message: string;
  data: AdminCashout;
}

export async function updateCashoutStatus(id: string, params: UpdateCashoutStatusParams): Promise<UpdateCashoutStatusResponse> {
  return serverFetch<UpdateCashoutStatusResponse>(`/cashouts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

// ==================== RIDER APPLICATIONS ====================

export type RiderAccountStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";

export interface RiderApplicationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  createdAt: string;
}

export interface RiderApplication {
  id: string;
  userId: string;
  district: string;
  accountStatus: RiderAccountStatus;
  currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  rating: number;
  totalRatings: number;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
  user: RiderApplicationUser;
}

export interface RiderApplicationsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RiderApplicationsResponse {
  success: boolean;
  message: string;
  data: RiderApplication[];
  meta: RiderApplicationsMeta;
}

export interface GetRiderApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: RiderAccountStatus | "ALL";
  district?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getAllRiderApplications(params: GetRiderApplicationsParams = {}): Promise<RiderApplicationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.accountStatus && params.accountStatus !== "ALL") searchParams.set("accountStatus", params.accountStatus);
  if (params.district) searchParams.set("district", params.district);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  return serverFetch<RiderApplicationsResponse>(`/rider/applications?${searchParams.toString()}`);
}

export interface UpdateRiderAccountStatusParams {
  accountStatus: RiderAccountStatus;
}

export interface UpdateRiderAccountStatusResponse {
  success: boolean;
  message: string;
  data: RiderApplication;
}


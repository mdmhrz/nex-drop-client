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

export interface RiderUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Rider {
  id: string;
  userId: string;
  district: string;
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
  currentStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  user: RiderUser;
}

export type ParcelStatus = "REQUESTED" | "ASSIGNED" | "PICKED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

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
  rider?: Rider;
}

export interface ParcelsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ParcelsResponse {
  success: boolean;
  message: string;
  data: Parcel[];
  meta: ParcelsMeta;
}

export interface GetParcelsParams {
  page?: number;
  limit?: number;
}

export async function getParcels(params: GetParcelsParams = {}): Promise<ParcelsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<ParcelsResponse>(`/parcels/my?${searchParams.toString()}`);
}

export interface CancelParcelParams {
  note?: string;
}

export interface CancelParcelResponse {
  success: boolean;
  message: string;
  data: Parcel;
}

export async function cancelParcel(id: string, params: CancelParcelParams = {}): Promise<CancelParcelResponse> {
  return serverFetch<CancelParcelResponse>(`/parcels/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ";

export interface InitiatePaymentParams {
  paymentMethod: PaymentMethod;
}

export interface InitiatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
    sessionId: string;
    paymentId: string;
    amount: number;
  };
}

export async function initiatePayment(id: string, params: InitiatePaymentParams): Promise<InitiatePaymentResponse> {
  return serverFetch<InitiatePaymentResponse>(`/parcels/${id}/payment`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

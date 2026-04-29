import "server-only";
import { serverFetch } from "@/lib/serverFetch";
import type {
    RatingsResponse,
    RatingSummaryResponse,
    GetRiderRatingsParams,
    MyRatingsResponse,
    RecentReviewsResponse,
} from "./rating.service";

export async function getRiderRatings(
    riderId: string,
    params: GetRiderRatingsParams = {}
): Promise<RatingsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    const qs = searchParams.toString();
    return serverFetch<RatingsResponse>(`/ratings/rider/${riderId}${qs ? `?${qs}` : ""}`);
}

export async function getRiderRatingSummary(riderId: string): Promise<RatingSummaryResponse> {
    return serverFetch<RatingSummaryResponse>(`/ratings/rider/${riderId}/summary`);
}

export async function getMyRatings(): Promise<MyRatingsResponse> {
    return serverFetch<MyRatingsResponse>("/ratings/my");
}

export async function getRecentReviews(limit = 6): Promise<RecentReviewsResponse> {
    return serverFetch<RecentReviewsResponse>(`/reviews/recent?limit=${limit}`, { auth: false });
}

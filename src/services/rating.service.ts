import { api } from "@/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RatingCustomer {
    id: string;
    name: string;
}

export interface RatingParcel {
    id: string;
    trackingId: string;
}

export interface Rating {
    id: string;
    riderId: string;
    customerId: string;
    parcelId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RatingWithDetails extends Rating {
    customer: RatingCustomer;
    parcel: RatingParcel;
}

export interface RatingsResponseMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface RatingsResponse {
    success: boolean;
    message: string;
    data: RatingWithDetails[];
    meta: RatingsResponseMeta;
}

export interface RatingDistribution {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

export interface RatingSummary {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: RatingDistribution;
}

export interface RatingSummaryResponse {
    success: boolean;
    message: string;
    data: RatingSummary;
}

export interface RecentReviewRider {
    name: string;
}

export interface RecentReviewCustomer {
    name: string;
}

export interface RecentReviewParcel {
    trackingId: string;
}

export interface RecentReview {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    customer: RecentReviewCustomer;
    rider: RecentReviewRider;
    parcel?: RecentReviewParcel;
}

export interface RecentReviewsResponse {
    success: boolean;
    message: string;
    data: RecentReview[];
}

export interface SubmitRatingData {
    parcelId: string;
    rating: number;
    comment?: string;
}

export interface SubmitRatingResponse {
    success: boolean;
    message: string;
    data: Rating;
}

export interface UpdateRatingData {
    rating?: number;
    comment?: string;
}

export interface UpdateRatingResponse {
    success: boolean;
    message: string;
    data: Rating;
}

export interface DeleteRatingResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface GetRiderRatingsParams {
    page?: number;
    limit?: number;
}

export interface MyRating {
    id: string;
    riderId: string;
    customerId: string;
    parcelId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
    parcel: { id: string; trackingId: string };
}

export interface MyRatingsResponse {
    success: boolean;
    message: string;
    data: MyRating[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ratingService = {
    // Customer: Submit a rating
    submit: (data: SubmitRatingData): Promise<SubmitRatingResponse> =>
        api.post<SubmitRatingResponse>("/ratings", data),

    // Customer: Update a rating (within 24h)
    update: (id: string, data: UpdateRatingData): Promise<UpdateRatingResponse> =>
        api.patch<UpdateRatingResponse>(`/ratings/${id}`, data),

    // Customer: Delete a rating (within 24h)
    delete: (id: string): Promise<DeleteRatingResponse> =>
        api.delete<DeleteRatingResponse>(`/ratings/${id}`),

    // Public: Get paginated ratings for a rider
    getRiderRatings: (riderId: string, params: GetRiderRatingsParams = {}): Promise<RatingsResponse> =>
        api.get<RatingsResponse>(`/ratings/rider/${riderId}`, { params }),

    // Public: Get rating summary for a rider
    getRiderRatingSummary: (riderId: string): Promise<RatingSummaryResponse> =>
        api.get<RatingSummaryResponse>(`/ratings/rider/${riderId}/summary`),

    // Public: Get recent reviews for landing page
    getRecentReviews: (limit = 10): Promise<RecentReviewsResponse> =>
        api.get<RecentReviewsResponse>("/ratings/reviews/recent", { params: { limit } }),

    // Customer: Get all my submitted ratings
    getMyRatings: (): Promise<MyRatingsResponse> =>
        api.get<MyRatingsResponse>("/ratings/my"),
};

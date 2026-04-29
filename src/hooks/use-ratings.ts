import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ratingService } from "@/services/rating.service";
import type {
    GetRiderRatingsParams,
    SubmitRatingData,
    UpdateRatingData,
} from "@/services/rating.service";

export type {
    Rating,
    RatingWithDetails,
    RatingsResponse,
    RatingSummary,
    RatingSummaryResponse,
    RecentReview,
    RecentReviewsResponse,
    GetRiderRatingsParams,
    SubmitRatingData,
    UpdateRatingData,
    MyRating,
    MyRatingsResponse,
} from "@/services/rating.service";

export const RIDER_RATINGS_KEY = "rider-ratings";
export const RIDER_RATING_SUMMARY_KEY = "rider-rating-summary";
export const RECENT_REVIEWS_KEY = ["recent-reviews"];
export const MY_RATINGS_KEY = ["my-ratings"];

export function useRiderRatings(riderId: string, params: GetRiderRatingsParams = {}) {
    return useQuery({
        queryKey: [RIDER_RATINGS_KEY, riderId, params],
        queryFn: () => ratingService.getRiderRatings(riderId, params),
        staleTime: 1000 * 60 * 5,
        enabled: !!riderId,
    });
}

export function useRiderRatingSummary(riderId: string) {
    return useQuery({
        queryKey: [RIDER_RATING_SUMMARY_KEY, riderId],
        queryFn: () => ratingService.getRiderRatingSummary(riderId),
        staleTime: 1000 * 60 * 5,
        enabled: !!riderId,
    });
}

export function useRecentReviews(limit = 10) {
    return useQuery({
        queryKey: [...RECENT_REVIEWS_KEY, limit],
        queryFn: () => ratingService.getRecentReviews(limit),
        staleTime: 1000 * 60 * 10,
    });
}

export function useMyRatings() {
    return useQuery({
        queryKey: MY_RATINGS_KEY,
        queryFn: () => ratingService.getMyRatings(),
        staleTime: Infinity,
    });
}

export function useSubmitRating(onSuccess?: (rating: import("@/services/rating.service").Rating) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitRatingData) => ratingService.submit(data),
        onSuccess: (response) => {
            toast.success(response.message || "Rating submitted successfully");
            queryClient.invalidateQueries({ queryKey: [RIDER_RATINGS_KEY] });
            queryClient.invalidateQueries({ queryKey: [RIDER_RATING_SUMMARY_KEY] });
            queryClient.invalidateQueries({ queryKey: MY_RATINGS_KEY });
            onSuccess?.(response.data);
        },
        onError: (error: unknown) => {
            const message = (error as { message?: string })?.message || "Failed to submit rating";
            toast.error(message);
        },
    });
}

export function useUpdateRating(onSuccess?: (rating: import("@/services/rating.service").Rating) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRatingData }) =>
            ratingService.update(id, data),
        onSuccess: (response) => {
            toast.success(response.message || "Rating updated successfully");
            queryClient.invalidateQueries({ queryKey: [RIDER_RATINGS_KEY] });
            queryClient.invalidateQueries({ queryKey: [RIDER_RATING_SUMMARY_KEY] });
            queryClient.invalidateQueries({ queryKey: MY_RATINGS_KEY });
            onSuccess?.(response.data);
        },
        onError: (error: unknown) => {
            const message = (error as { message?: string })?.message || "Failed to update rating";
            toast.error(message);
        },
    });
}

export function useDeleteRating(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ratingService.delete(id),
        onSuccess: (response) => {
            toast.success(response.message || "Rating deleted successfully");
            queryClient.invalidateQueries({ queryKey: [RIDER_RATINGS_KEY] });
            queryClient.invalidateQueries({ queryKey: [RIDER_RATING_SUMMARY_KEY] });
            queryClient.invalidateQueries({ queryKey: MY_RATINGS_KEY });
            onSuccess?.();
        },
        onError: (error: unknown) => {
            const message = (error as { message?: string })?.message || "Failed to delete rating";
            toast.error(message);
        },
    });
}

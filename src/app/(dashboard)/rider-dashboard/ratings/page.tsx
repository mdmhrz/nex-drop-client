import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";
import { RIDER_RATINGS_KEY, RIDER_RATING_SUMMARY_KEY } from "@/hooks/use-ratings";
import { RiderRatingsContent } from "@/components/dashboard/rider/rider-ratings-content";
import { getRiderProfile } from "@/services/rider.server";
import { getRiderRatings, getRiderRatingSummary } from "@/services/rating.server";

export default async function RiderRatingsPage() {
    const queryClient = new QueryClient();

    // Prefetch rider profile (needed for riderId)
    const profileRes = await getRiderProfile();
    queryClient.setQueryData(RIDER_PROFILE_KEY, profileRes);

    const riderId = profileRes.data.id;

    // Prefetch ratings and summary in parallel
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: [RIDER_RATINGS_KEY, riderId, { page: 1, limit: 10 }],
            queryFn: () => getRiderRatings(riderId, { page: 1, limit: 10 }),
        }),
        queryClient.prefetchQuery({
            queryKey: [RIDER_RATING_SUMMARY_KEY, riderId],
            queryFn: () => getRiderRatingSummary(riderId),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RiderRatingsContent />
        </HydrationBoundary>
    );
}

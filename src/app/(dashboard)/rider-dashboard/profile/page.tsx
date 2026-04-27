import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";
import { RiderProfileContent } from "@/components/dashboard/rider/rider-profile-content";
import { getRiderProfile } from "@/services/rider.server";

export default async function RiderProfilePage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: RIDER_PROFILE_KEY,
        queryFn: () => getRiderProfile(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RiderProfileContent />
        </HydrationBoundary>
    );
}

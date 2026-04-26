import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";
import { RiderProfileContent } from "@/components/dashboard/rider/rider-profile-content";



export default async function RiderProfilePage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: RIDER_PROFILE_KEY,
        queryFn: () => api.get("/rider/me"),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <RiderProfileContent />
        </HydrationBoundary>
    );
}

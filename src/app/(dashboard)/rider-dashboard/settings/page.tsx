import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";

import { getRiderProfile, type RiderProfileResponse } from "@/services/rider.server";
import { SettingsContent } from "@/components/shared/settings-content";

export default async function RiderSettingsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: RIDER_PROFILE_KEY,
        queryFn: () => getRiderProfile(),
    });

    const prefetched = queryClient.getQueryData(RIDER_PROFILE_KEY) as RiderProfileResponse | undefined;
    const currentStatus = prefetched?.data?.currentStatus;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SettingsContent userRole="RIDER" currentStatus={currentStatus} />
        </HydrationBoundary>
    );
}

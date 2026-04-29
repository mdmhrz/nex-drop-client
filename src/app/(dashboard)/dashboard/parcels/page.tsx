import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { PARCELS_KEY } from "@/hooks/use-parcels";
import { MY_RATINGS_KEY } from "@/hooks/use-ratings";
import { ParcelsPageContent } from "@/components/dashboard/customer/parcels-page-content";
import { getParcels } from "@/services/user.server";
import { getMyRatings } from "@/services/rating.server";

export default async function CustomerParcelsPage() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: [...PARCELS_KEY, { page: 1, limit: 10 }],
            queryFn: () => getParcels({ page: 1, limit: 10 }),
        }),
        queryClient.prefetchQuery({
            queryKey: MY_RATINGS_KEY,
            queryFn: () => getMyRatings(),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ParcelsPageContent />
        </HydrationBoundary>
    );
}

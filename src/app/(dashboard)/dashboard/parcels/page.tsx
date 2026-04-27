import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { PARCELS_KEY } from "@/hooks/use-parcels";
import { ParcelsPageContent } from "@/components/dashboard/customer/parcels-page-content";
import { getParcels } from "@/services/user.server";

export default async function CustomerParcelsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [...PARCELS_KEY, { page: 1, limit: 10 }],
        queryFn: () => getParcels({ page: 1, limit: 10 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ParcelsPageContent />
        </HydrationBoundary>
    );
}

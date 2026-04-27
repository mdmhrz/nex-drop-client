import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { EARNINGS_KEY } from "@/hooks/use-earnings";
import { EarningsPageContent } from "@/components/dashboard/rider/earnings-page-content";
import { getEarnings } from "@/services/rider.server";

export default async function RiderEarningsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [...EARNINGS_KEY, { page: 1, limit: 10 }],
        queryFn: () => getEarnings({ page: 1, limit: 10 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EarningsPageContent />
        </HydrationBoundary>
    );
}

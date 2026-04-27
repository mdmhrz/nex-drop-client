import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { EARNINGS_KEY } from "@/hooks/use-earnings";
import { EarningsTable } from "@/components/dashboard/rider/earnings-table";
import { EarningsPageContent } from "@/components/dashboard/rider/earnings-page-content";

export default async function RiderEarningsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [...EARNINGS_KEY, { page: 1, limit: 10 }],
        queryFn: () => api.get("/rider/earnings/history", {
            params: { page: 1, limit: 10 },
        }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EarningsPageContent />
        </HydrationBoundary>
    );
}

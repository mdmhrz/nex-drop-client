import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { CASHOUTS_KEY } from "@/hooks/use-cashouts";
import { CashoutsPageContent } from "@/components/dashboard/rider/cashouts-page-content";
import { getRiderDashboard, getCashouts } from "@/services/rider.server";

export default async function RiderCashoutsPage() {
    const queryClient = new QueryClient();

    const dashboardData = await getRiderDashboard();
    const availableAmount = dashboardData.data.overview.availableEarnings;

    await queryClient.prefetchQuery({
        queryKey: [...CASHOUTS_KEY, { page: 1, limit: 10 }],
        queryFn: () => getCashouts({ page: 1, limit: 10 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CashoutsPageContent initialAvailableAmount={availableAmount} />
        </HydrationBoundary>
    );
}

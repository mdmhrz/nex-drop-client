import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_CASHOUTS_KEY } from "@/hooks/use-admin-cashouts";
import { getAllCashouts } from "@/services/admin.server";
import { AdminCashoutsTable } from "@/components/dashboard/admin/admin-cashouts-table";

export default async function AdminPaymentsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ADMIN_CASHOUTS_KEY,
        queryFn: () => getAllCashouts({ page: 1, limit: 10 }),
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Track and manage all payments and cashouts.</p>
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminCashoutsTable />
            </HydrationBoundary>
        </div>
    );
}

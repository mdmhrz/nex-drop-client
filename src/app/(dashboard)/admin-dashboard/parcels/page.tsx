import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_PARCELS_KEY } from "@/hooks/use-admin-parcels";
import { getAllParcels } from "@/services/admin.server";
import { AdminParcelsTable } from "@/components/dashboard/admin/admin-parcels-table";

export default async function AdminParcelsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ADMIN_PARCELS_KEY,
        queryFn: () => getAllParcels({ page: 1, limit: 10 }),
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Parcels</h1>
                <p className="text-muted-foreground">Manage all parcels in the system.</p>
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminParcelsTable />
            </HydrationBoundary>
        </div>
    );
}

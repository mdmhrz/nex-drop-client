import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_RIDER_APPLICATIONS_KEY } from "@/hooks/use-admin-rider-applications";
import { getAllRiderApplications } from "@/services/admin.server";
import { AdminRidersTable } from "@/components/dashboard/admin/admin-riders-table";

export default async function AdminRidersPage() {
    const queryClient = new QueryClient();

    // Prefetch active riders (default tab)
    await queryClient.prefetchQuery({
        queryKey: [...ADMIN_RIDER_APPLICATIONS_KEY, { page: 1, limit: 10, accountStatus: "ACTIVE" }],
        queryFn: () => getAllRiderApplications({ page: 1, limit: 10, accountStatus: "ACTIVE" }),
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Riders</h1>
                <p className="text-muted-foreground">
                    Manage active riders and review new applications.
                </p>
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminRidersTable />
            </HydrationBoundary>
        </div>
    );
}

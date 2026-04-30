import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_USERS_KEY } from "@/hooks/use-admin-users";
import { getAllUsers } from "@/services/admin.server";
import { AdminUsersTable } from "@/components/dashboard/admin/admin-users-table";

export default async function AdminUsersPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ADMIN_USERS_KEY,
        queryFn: () => getAllUsers({ page: 1, limit: 10 }),
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">Manage all users in the system.</p>
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminUsersTable />
            </HydrationBoundary>
        </div>
    );
}

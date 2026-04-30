import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_USERS_KEY } from "@/hooks/use-admin-users";
import { getUserById } from "@/services/admin.server";
import { AdminUserDetailsContent } from "@/components/dashboard/admin/admin-user-details-content";

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [...ADMIN_USERS_KEY, id],
        queryFn: () => getUserById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminUserDetailsContent userId={id} />
        </HydrationBoundary>
    );
}

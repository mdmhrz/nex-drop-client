import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { CUSTOMER_PROFILE_KEY } from "@/hooks/use-customer-profile";

import { authService } from "@/services/auth.service";
import { AdminProfileContent } from "@/components/dashboard/admin/admin-profile-content";

export default async function AdminProfilePage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: CUSTOMER_PROFILE_KEY,
        queryFn: () => authService.getMe(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminProfileContent />
        </HydrationBoundary>
    );
}

import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { CUSTOMER_PROFILE_KEY } from "@/hooks/use-customer-profile";

import { authService } from "@/services/auth.service";
import { CustomerProfileContent } from "@/components/dashboard/customer/customer-profile-content";

export default async function CustomerProfilePage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: CUSTOMER_PROFILE_KEY,
        queryFn: () => authService.getMe(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerProfileContent />
        </HydrationBoundary>
    );
}

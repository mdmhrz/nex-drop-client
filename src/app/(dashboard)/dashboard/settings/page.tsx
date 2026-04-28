import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { CUSTOMER_PROFILE_KEY } from "@/hooks/use-customer-profile";

import { authService } from "@/services/auth.service";
import { CustomerSettingsContent } from "@/components/dashboard/customer/customer-settings-content";

export default async function CustomerSettingsPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: CUSTOMER_PROFILE_KEY,
        queryFn: () => authService.getMe(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomerSettingsContent />
        </HydrationBoundary>
    );
}

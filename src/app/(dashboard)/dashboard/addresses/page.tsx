import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADDRESSES_KEY } from "@/hooks/use-addresses";
import { getAddresses } from "@/services/address.server";
import { AddressesPageContent } from "@/components/dashboard/customer/addresses-page-content";

export default async function CustomerAddressesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [...ADDRESSES_KEY, { page: 1, limit: 10 }],
        queryFn: () => getAddresses({ page: 1, limit: 10 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AddressesPageContent />
        </HydrationBoundary>
    );
}

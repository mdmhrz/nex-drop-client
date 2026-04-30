import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { getParcelById } from "@/services/parcel.server";
import { AdminParcelDetailsContent } from "@/components/dashboard/admin/admin-parcel-details-content";

export default async function AdminParcelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["admin", "parcels", id],
        queryFn: () => getParcelById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminParcelDetailsContent parcelId={id} />
        </HydrationBoundary>
    );
}

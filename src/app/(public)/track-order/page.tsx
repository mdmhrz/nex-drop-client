
import { TrackOrderContent } from "@/components/public/track-order-content";
import { getParcelByTrackingId } from "@/services/parcel.server";

export default async function TrackOrderPage({
    searchParams,
}: {
    searchParams: Promise<{ trackingId?: string }>;
}) {
    const { trackingId } = await searchParams;
    let parcel = null;

    if (trackingId) {
        try {
            const response = await getParcelByTrackingId(trackingId);
            parcel = response.data;
        } catch {
            parcel = null;
        }
    }

    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20">
            <TrackOrderContent initialParcel={parcel} initialTrackingId={trackingId || ""} />
        </section>
    );
}
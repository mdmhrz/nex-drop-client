import { SectionWrapper } from "@/components/home/section-wrapper";
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
        <SectionWrapper>
            <TrackOrderContent initialParcel={parcel} initialTrackingId={trackingId || ""} />
        </SectionWrapper>
    );
}
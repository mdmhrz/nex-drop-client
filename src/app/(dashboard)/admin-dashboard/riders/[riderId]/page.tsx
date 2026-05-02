import { AdminRiderApplicationDetailsContent } from "@/components/dashboard/admin/admin-rider-application-details-content";

interface Props {
    params: Promise<{ riderId: string }>;
}

export default async function AdminRiderDetailsPage({ params }: Props) {
    const { riderId } = await params;

    return <AdminRiderApplicationDetailsContent riderId={riderId} />;
}

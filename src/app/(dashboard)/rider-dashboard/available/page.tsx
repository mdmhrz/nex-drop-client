import { AvailableParcelsTable } from "@/components/layouts/dashboard/rider/available-parcels-table";

export default function AvailableParcelsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Available Parcels</h1>
                <p className="text-muted-foreground">
                    Browse parcels ready for pickup and accept a delivery.
                </p>
            </div>
            <AvailableParcelsTable />
        </div>
    );
}

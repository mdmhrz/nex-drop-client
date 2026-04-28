import { AssignedParcelsTable } from "@/components/dashboard/rider/assigned-parcels-table";

export default function RiderDeliveriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">My Deliveries</h1>
                <p className="text-muted-foreground">
                    View and manage your active deliveries.
                </p>
            </div>
            <AssignedParcelsTable />
        </div>
    );
}

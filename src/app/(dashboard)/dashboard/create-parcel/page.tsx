import { CreateParcelForm } from "@/components/dashboard/customer/create-parcel-form";

export default function CreateParcelPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Parcel</h1>
                <p className="text-muted-foreground">Fill in the details below to request a new parcel delivery.</p>
            </div>
            <CreateParcelForm />
        </div>
    );
}


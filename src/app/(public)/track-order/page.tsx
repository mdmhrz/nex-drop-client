import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Search, CheckCircle2 } from "lucide-react";

// Sample data - will be replaced with API call
const sampleParcel = {
    id: "019da724-e448-765d-aea1-06168526539c",
    trackingId: "PKG-1776625706036-KMMD4I",
    status: "DELIVERED",
    price: 600,
    isPaid: true,
    createdAt: "2026-04-19T19:08:26.056Z",
    customer: {
        name: "Md Mobarak Hossain Razu",
        email: "xgenious.mobarak@gmail.com",
    },
    pickupAddress: "Check6",
    deliveryAddress: "Chandpur",
    districtFrom: "Coxbazar",
    districtTo: "Chandpur",
    rider: {
        user: {
            name: "Rider",
        },
    },
    statusLogs: [
        {
            id: "1",
            status: "DELIVERED",
            timestamp: "2026-04-19T19:12:15.845Z",
            user: { name: "Rider" },
        },
        {
            id: "2",
            status: "IN_TRANSIT",
            timestamp: "2026-04-19T19:12:04.556Z",
            user: { name: "Rider" },
        },
        {
            id: "3",
            status: "ASSIGNED",
            timestamp: "2026-04-19T19:11:26.459Z",
            user: { name: "Rider" },
        },
        {
            id: "4",
            status: "REQUESTED",
            timestamp: "2026-04-19T19:08:26.061Z",
            user: { name: "Customer" },
        },
        {
            id: "5",
            status: "ASSIGNED",
            timestamp: "2026-04-19T19:07:00.000Z",
            user: { name: "Rider" },
        },
        {
            id: "6",
            status: "IN_TRANSIT",
            timestamp: "2026-04-19T19:05:30.000Z",
            user: { name: "Rider" },
        },
        {
            id: "7",
            status: "ASSIGNED",
            timestamp: "2026-04-19T19:04:15.000Z",
            user: { name: "Rider" },
        },
    ],
};

const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
        case "DELIVERED":
            return "bg-green-100 text-green-700";
        case "IN_TRANSIT":
            return "bg-blue-100 text-blue-700";
        case "ASSIGNED":
            return "bg-purple-100 text-purple-700";
        case "REQUESTED":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const getStatusDescription = (status: string) => {
    switch (status.toUpperCase()) {
        case "DELIVERED":
            return "Delivered";
        case "IN_TRANSIT":
            return "In transit";
        case "ASSIGNED":
            return "Assigned to rider";
        case "REQUESTED":
            return "Order requested";
        default:
            return status;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export default function TrackOrderPage() {
    return (
        <SectionWrapper>
            <div className="space-y-8 pt-10">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Track Your Consignment
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Now you can easily track your consignment
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex gap-3 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tracking code here"
                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        // defaultValue={sampleParcel.trackingId}
                        />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                        Search
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Product Details Card */}
                    <div className="border border-border rounded-lg p-6 md:p-8 bg-card">
                        <div className="space-y-6">
                            <h2 className="section-heading-text text-2xl font-bold">
                                Product details
                            </h2>

                            <div className="space-y-4 text-sm">
                                {/* Date */}
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDate(sampleParcel.createdAt)}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatTime(sampleParcel.createdAt)}
                                    </p>
                                </div>

                                {/* Tracking Code */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Tracking Code
                                    </p>
                                    <p className="font-medium text-foreground text-sm break-all">
                                        {sampleParcel.trackingId}
                                    </p>
                                </div>

                                {/* Invoice */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Invoice</p>
                                    <p className="font-medium text-foreground text-sm">
                                        {sampleParcel.id.substring(0, 8)}
                                    </p>
                                </div>

                                {/* Customer Name */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Name</p>
                                    <p className="font-medium text-foreground text-sm">
                                        {sampleParcel.customer.name}
                                    </p>
                                </div>

                                {/* Address */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Address</p>
                                    <p className="font-medium text-foreground text-sm">
                                        {sampleParcel.deliveryAddress}, {sampleParcel.districtTo}
                                    </p>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Phone Number
                                    </p>
                                    <p className="font-medium text-foreground text-sm">
                                        +88017XXXXXXXX
                                    </p>
                                </div>

                                {/* Approved */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Approved
                                    </p>
                                    <p className="font-medium text-foreground text-sm">N/A</p>
                                </div>

                                {/* Weight */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Weight</p>
                                    <p className="font-medium text-foreground text-sm">XS</p>
                                </div>

                                {/* COD */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">COD</p>
                                    <p className="font-medium text-foreground text-sm">
                                        ৳ {sampleParcel.price}
                                    </p>
                                </div>

                                {/* Status */}
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Status</p>
                                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getStatusBadgeColor(sampleParcel.status)}`}>
                                        {sampleParcel.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Updates Card */}
                    <div className="border border-border rounded-lg p-6 md:p-8 bg-card">
                        <div className="space-y-6">
                            <h2 className="section-heading-text text-2xl font-bold">
                                Tracking Updates
                            </h2>

                            <div className="space-y-4">
                                {sampleParcel.statusLogs.map((log, index) => (
                                    <div key={log.id} className="flex gap-4">
                                        {/* Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            {index < sampleParcel.statusLogs.length - 1 && (
                                                <div className="w-0.5 h-12 bg-border mt-2" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="pb-4">
                                            <p className="text-xs text-muted-foreground mb-0.5">
                                                {formatDate(log.timestamp)}
                                            </p>
                                            <p className="text-xs text-muted-foreground mb-1.5">
                                                {formatTime(log.timestamp)}
                                            </p>
                                            <p className="text-sm text-foreground font-medium">
                                                {getStatusDescription(log.status)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
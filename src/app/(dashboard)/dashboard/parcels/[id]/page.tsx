
import Link from "next/link";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { getParcelById, ParcelStatusLog, type Parcel as ParcelType } from "@/services/parcel.server";
import { getMyRatings } from "@/services/rating.server";
import { MY_RATINGS_KEY } from "@/hooks/use-ratings";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { DateDisplay } from "@/components/shared/date-display";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Package, CircleDollarSign, CalendarDays, PackageX } from "lucide-react";
import { ParcelRatingSection } from "@/components/dashboard/customer/parcel-rating-section";

export default async function ParcelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let res;
    try {
        res = await getParcelById(id);
    } catch (err) {
        console.error("Failed to fetch parcel", err);
        return (
            <div className="h-full flex items-center justify-center">
                <EmptyState
                    icon={PackageX}
                    title="Parcel not found"
                    description="We couldn't load this parcel. It may not exist or you may not have permission to view it."
                    actions={[
                        { label: "Back to Parcels", href: "/dashboard/parcels", variant: "outline" },
                        { label: "Contact Support", href: "/contact", variant: "default" },
                    ]}
                />
            </div>
        );
    }

    const parcel: ParcelType = res.data;

    const queryClient = new QueryClient();
    if (parcel.status === "DELIVERED") {
        await queryClient.prefetchQuery({
            queryKey: MY_RATINGS_KEY,
            queryFn: () => getMyRatings(),
        });
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/parcels">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="section-heading-text text-2xl font-bold tracking-tight">Parcel Details</h1>
                        <p className="text-muted-foreground">Tracking ID: {parcel.trackingId}</p>
                    </div>
                </div>

                {/* Overview Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>{parcel.id}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge
                                    status={
                                        parcel.status === "DELIVERED"
                                            ? "success"
                                            : parcel.status === "CANCELLED"
                                                ? "error"
                                                : "warning"
                                    }
                                    variant="default"
                                >
                                    {parcel.status}
                                </StatusBadge>
                                <Badge variant={parcel.isPaid ? "default" : "outline"}>
                                    {parcel.isPaid ? "Paid" : "Unpaid"}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Pickup Address</p>
                                    <p className="font-medium">{parcel.pickupAddress}</p>
                                    <p className="text-xs text-muted-foreground">{parcel.districtFrom}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                                    <p className="font-medium">{parcel.deliveryAddress}</p>
                                    <p className="text-xs text-muted-foreground">{parcel.districtTo}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CircleDollarSign className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-medium">৳ {parcel.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarDays className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <DateDisplay value={parcel.createdAt} className="font-medium" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <UserAvatar name={parcel.customer?.name || "Customer"} />
                                <div>
                                    <p className="font-medium">{parcel.customer?.name}</p>
                                    <p className="text-xs text-muted-foreground">{parcel.customer?.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Phone</span>
                                    <span className="font-medium">{parcel.customer?.phone}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rider Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rider</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {parcel.rider ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <UserAvatar name={parcel.rider.user?.name || "Rider"} />
                                        <div>
                                            <p className="font-medium">{parcel.rider.user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{parcel.rider.user?.email}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Phone</span>
                                            <span className="font-medium">{parcel.rider.user?.phone}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">District</span>
                                            <span className="font-medium">{parcel.rider.district}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge variant="outline">{parcel.rider.currentStatus}</Badge>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <Package className="size-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No rider assigned yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Status History Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                        <CardDescription>Full timeline of parcel status changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {parcel.statusLogs?.length ? (
                            <div className="space-y-3">
                                {parcel.statusLogs.map((log: ParcelStatusLog) => (
                                    <div key={log.id} className="flex items-start gap-4 p-3 border rounded-md">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <StatusBadge
                                                    status={
                                                        log.status === "DELIVERED"
                                                            ? "success"
                                                            : log.status === "CANCELLED"
                                                                ? "error"
                                                                : "warning"
                                                    }
                                                    variant="default"
                                                >
                                                    {log.status}
                                                </StatusBadge>
                                                <DateDisplay value={log.timestamp} className="text-xs text-muted-foreground shrink-0" />
                                            </div>
                                            {log.note && <p className="mt-1 text-sm">{log.note}</p>}
                                            <p className="mt-1 text-xs text-muted-foreground">By: {log.user?.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <Package className="size-8 mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No status history available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Rating Section — only for DELIVERED parcels */}
                {parcel.status === "DELIVERED" && (
                    <ParcelRatingSection parcelId={parcel.id} />
                )}
            </div>
        </HydrationBoundary>
    );
}

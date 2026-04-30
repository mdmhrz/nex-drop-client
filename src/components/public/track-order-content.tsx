"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Search, CheckCircle2, Package, Calendar, X, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { format } from "date-fns";
import type { Parcel, ParcelStatusLog } from "@/services/parcel.server";

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
    case "CANCELLED":
      return "bg-red-100 text-red-700";
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
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const parcelLifecycleSteps = [
  { key: "REQUESTED", label: "Requested" },
  { key: "PAID", label: "Paid" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "PICKED", label: "Picked" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERED", label: "Delivered" },
];

const getStepStatus = (stepKey: string, parcelStatus: string, isPaid: boolean) => {
  const status = parcelStatus.toUpperCase();

  // If cancelled, all steps are pending
  if (status === "CANCELLED") {
    return "pending";
  }

  // Check if this step is completed
  switch (stepKey) {
    case "REQUESTED":
      return "completed";
    case "PAID":
      return isPaid ? "completed" : "pending";
    case "ASSIGNED":
      return ["ASSIGNED", "PICKED", "IN_TRANSIT", "DELIVERED"].includes(status) ? "completed" : "pending";
    case "PICKED":
      return ["PICKED", "IN_TRANSIT", "DELIVERED"].includes(status) ? "completed" : "pending";
    case "IN_TRANSIT":
      return ["IN_TRANSIT", "DELIVERED"].includes(status) ? "completed" : "pending";
    case "DELIVERED":
      return status === "DELIVERED" ? "completed" : "pending";
    default:
      return "pending";
  }
};

const getCurrentStepIndex = (parcelStatus: string, isPaid: boolean) => {
  const status = parcelStatus.toUpperCase();
  if (status === "CANCELLED") return -1;

  if (status === "DELIVERED") return 5;
  if (status === "IN_TRANSIT") return 4;
  if (status === "PICKED") return 3;
  if (status === "ASSIGNED") return 2;
  if (status === "REQUESTED") return isPaid ? 1 : 0;

  return 0;
};

interface TrackOrderContentProps {
  initialParcel?: Parcel | null;
  initialTrackingId?: string;
}

export function TrackOrderContent({ initialParcel, initialTrackingId = "" }: TrackOrderContentProps) {
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [searchQuery, setSearchQuery] = useState(initialTrackingId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["parcel", "tracking", searchQuery],
    queryFn: () => api.get<{ success: boolean; message: string; data: Parcel }>(`/parcels/track/${searchQuery}`),
    enabled: !!searchQuery && !initialParcel,
    retry: false,
    initialData: initialParcel ? { success: true, message: "Parcel fetched successfully", data: initialParcel } : undefined,
  });

  const handleSearch = () => {
    if (trackingId.trim()) {
      setSearchQuery(trackingId.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const parcel = data?.data;

  return (
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
          <Input
            type="text"
            placeholder="Search tracking code here"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={!trackingId.trim()}>
          Search
        </Button>
        {searchQuery && (
          <Button variant="outline" onClick={() => { setSearchQuery(""); setTrackingId(""); }}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Hint */}
      {!searchQuery && (
        <div className="max-w-md">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Tip:</strong> You can search using:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Full tracking ID (e.g., <code className="bg-background px-1 py-0.5 rounded text-xs">PKG-1777482097695-0WX0T1</code>)</li>
                <li>Partial tracking ID (e.g., <code className="bg-background px-1 py-0.5 rounded text-xs">PKG-177</code> or <code className="bg-background px-1 py-0.5 rounded text-xs">0wx0t1</code>)</li>
                <li>Case-insensitive search</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading && !initialParcel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      )}

      {error && !isLoading && !initialParcel && (
        <EmptyState
          icon={Package}
          title="Parcel Not Found"
          description="We couldn't find a parcel with that tracking ID. Please check and try again."
          actions={[
            { label: "Clear Search", href: "javascript:void(0)", variant: "outline" },
          ]}
        />
      )}

      {parcel && (
        <>
          {/* Progress Stepper */}
          <Card className="overflow-hidden border border-border/50">
            <CardContent className="p-0">
              <div className="px-8 py-8">
                <div className="relative flex items-start justify-between gap-0">

                  {/* Background connector line */}
                  <div
                    className="absolute left-0 right-0 h-px bg-border"
                    style={{ top: '20px' }}
                  />

                  {/* Filled progress line */}
                  <div
                    className="absolute left-0 h-px bg-primary transition-all duration-700 ease-in-out"
                    style={{
                      top: '20px',
                      width: `${(getCurrentStepIndex(parcel.status, parcel.isPaid)) / (parcelLifecycleSteps.length - 1) * 100}%`
                    }}
                  />

                  {parcelLifecycleSteps.map((step, index) => {
                    const stepStatus = getStepStatus(step.key, parcel.status, parcel.isPaid);
                    const isCompleted = stepStatus === "completed";
                    const isCurrent = getCurrentStepIndex(parcel.status, parcel.isPaid) === index;

                    return (
                      <div key={step.key} className="relative flex flex-col items-center flex-1 group">

                        {/* Node */}
                        <div className="relative z-10">
                          {isCompleted ? (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/15 transition-all duration-300">
                              <CheckCircle className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/20">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center transition-all duration-300">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="mt-4 text-center px-1 max-w-[80px]">
                          <p
                            className={`text-xs font-medium leading-snug transition-colors duration-200 ${isCompleted
                              ? "text-foreground"
                              : isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground/60"
                              }`}
                          >
                            {step.label}
                          </p>

                          {isCurrent && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wide uppercase">
                              Active
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-block mt-1.5 text-[10px] text-muted-foreground/60 font-medium">
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Date */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Date</p>
                  <p className="font-medium text-foreground text-sm">
                    {format(new Date(parcel.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>

                {/* Tracking Code */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tracking Code</p>
                  <p className="font-medium text-foreground text-sm break-all">
                    {parcel.trackingId}
                  </p>
                </div>

                {/* Invoice */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Invoice</p>
                  <p className="font-medium text-foreground text-sm">
                    {parcel.id.substring(0, 8)}
                  </p>
                </div>

                {/* Customer Name */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Name</p>
                  <p className="font-medium text-foreground text-sm">
                    {parcel.customer.name}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Address</p>
                  <p className="font-medium text-foreground text-sm">
                    {parcel.deliveryAddress}, {parcel.districtTo}
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Phone Number</p>
                  <p className="font-medium text-foreground text-sm">
                    {parcel.customer.phone || "N/A"}
                  </p>
                </div>

                {/* Price */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Price</p>
                  <p className="font-medium text-foreground text-sm">
                    ৳{parcel.price.toFixed(2)}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getStatusBadgeColor(parcel.status)}`}>
                    {parcel.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Updates Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Tracking Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcel.statusLogs && parcel.statusLogs.length > 0 ? (
                    parcel.statusLogs.map((log: ParcelStatusLog, index: number) => (
                      <div key={log.id} className="flex gap-4">
                        {/* Timeline Line */}
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          {parcel.statusLogs && index < parcel.statusLogs.length - 1 && (
                            <div className="w-0.5 h-12 bg-border mt-2" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-4">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {format(new Date(log.timestamp), "dd MMM yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1.5">
                            {format(new Date(log.timestamp), "HH:mm")}
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {getStatusDescription(log.status)}
                          </p>
                          {log.note && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tracking updates available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

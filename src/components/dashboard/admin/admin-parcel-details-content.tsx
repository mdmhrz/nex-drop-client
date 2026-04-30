"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, MapPin, User, DollarSign, Calendar, ArrowLeft, UserCheck, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ParcelStatus, Parcel } from "@/services/parcel.server";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useUpdateParcelStatus, useAssignRider } from "@/hooks/use-admin-parcels";
import { format } from "date-fns";

export function AdminParcelDetailsContent({ parcelId }: { parcelId: string }) {
  const router = useRouter();
  const [selectedParcelForStatus, setSelectedParcelForStatus] = useState(false);
  const [selectedParcelForRider, setSelectedParcelForRider] = useState(false);
  const [newStatus, setNewStatus] = useState<ParcelStatus>("REQUESTED");
  const [selectedRiderId, setSelectedRiderId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "parcels", parcelId],
    queryFn: () => api.get<{ success: boolean; message: string; data: Parcel }>(`/parcels/${parcelId}`),
    enabled: !!parcelId,
    staleTime: 0,
  });

  const updateStatusMutation = useUpdateParcelStatus();
  const assignRiderMutation = useAssignRider();

  const handleUpdateStatus = () => {
    if (data?.data) {
      updateStatusMutation.mutate(
        { id: parcelId, params: { status: newStatus } },
        {
          onSuccess: () => {
            setSelectedParcelForStatus(false);
          },
        }
      );
    }
  };

  const handleAssignRider = () => {
    if (selectedRiderId) {
      assignRiderMutation.mutate(
        { id: parcelId, params: { riderId: selectedRiderId } },
        {
          onSuccess: () => {
            setSelectedParcelForRider(false);
            setSelectedRiderId("");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    );
  }

  const parcel = data?.data;

  if (!parcel) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <EmptyState
          icon={Package}
          title="Parcel Not Found"
          description="The parcel you're looking for doesn't exist or you don't have permission to view it."
          actions={[
            { label: "Go Back", href: "javascript:history.back()", variant: "outline" },
            { label: "View All Parcels", href: "/admin-dashboard/parcels", variant: "default" },
          ]}
        />
      </div>
    );
  }

  const statusConfig: Record<ParcelStatus, "success" | "warning" | "destructive" | "default"> = {
    REQUESTED: "default",
    ASSIGNED: "warning",
    PICKED: "warning",
    IN_TRANSIT: "warning",
    DELIVERED: "success",
    CANCELLED: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading-text text-2xl font-bold tracking-tight">Parcel Details</h1>
          <p className="text-muted-foreground">View and manage parcel information.</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Parcel Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              Parcel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tracking ID</p>
              <p className="font-mono text-sm font-medium">{parcel.trackingId}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={statusConfig[parcel.status as ParcelStatus] || "default"} variant="default">
                {parcel.status}
              </StatusBadge>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                ৳{parcel.price.toFixed(2)}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge variant={parcel.isPaid ? "default" : "secondary"}>
                {parcel.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="text-sm">{parcel.districtFrom} → {parcel.districtTo}</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{parcel.customer.name}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm">{parcel.customer.email}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm">{parcel.customer.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Rider Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-5" />
              Rider Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parcel.rider ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{parcel.rider.user.name}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{parcel.rider.user.email}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">{parcel.rider.user.phone}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">District</p>
                  <p className="text-sm">{parcel.rider.district}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge variant="outline">{parcel.rider.currentStatus}</Badge>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCheck className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No rider assigned</p>
                <Button
                  onClick={() => setSelectedParcelForRider(true)}
                  size="sm"
                  variant="outline"
                  className="mt-4"
                >
                  Assign Rider
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Pickup Address</p>
            <p className="text-sm text-muted-foreground">{parcel.pickupAddress}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Delivery Address</p>
            <p className="text-sm text-muted-foreground">{parcel.deliveryAddress}</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-sm">{format(new Date(parcel.createdAt), "dd MMM yyyy, HH:mm")}</p>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm">{format(new Date(parcel.updatedAt), "dd MMM yyyy, HH:mm")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setNewStatus(parcel.status);
            setSelectedParcelForStatus(true);
          }}
          variant="outline"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Update Status
        </Button>
        {!parcel.rider && (
          <Button
            onClick={() => setSelectedParcelForRider(true)}
            variant="outline"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Assign Rider
          </Button>
        )}
      </div>

      {/* Update Status Dialog */}
      <Dialog open={selectedParcelForStatus} onOpenChange={setSelectedParcelForStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Parcel Status</DialogTitle>
            <DialogDescription>
              Change the status for parcel {parcel.trackingId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(value: ParcelStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REQUESTED">Requested</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="PICKED">Picked</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedParcelForStatus(false)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending || newStatus === parcel.status}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Rider Dialog */}
      <Dialog open={selectedParcelForRider} onOpenChange={setSelectedParcelForRider}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Rider</DialogTitle>
            <DialogDescription>
              Assign a rider to parcel {parcel.trackingId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rider ID</label>
              <Input
                placeholder="Enter rider ID"
                value={selectedRiderId}
                onChange={(e) => setSelectedRiderId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedParcelForRider(false)}
              disabled={assignRiderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignRider}
              disabled={assignRiderMutation.isPending || !selectedRiderId}
            >
              {assignRiderMutation.isPending ? "Assigning..." : "Assign Rider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

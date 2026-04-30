"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useAdminParcels, useAssignRider, useUpdateParcelStatus, type AdminParcel } from "@/hooks/use-admin-parcels";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { Eye, UserCheck, AlertTriangle, Search, X, MapPin } from "lucide-react";
import type { ParcelStatus } from "@/services/admin.server";
import { format } from "date-fns";

// ─── Column definitions ───────────────────────────────────────────────────────

const getParcelColumns = (
  onView: (parcel: AdminParcel) => void,
  onAssignRider: (parcel: AdminParcel) => void,
  onUpdateStatus: (parcel: AdminParcel) => void
): ColumnDef<AdminParcel>[] => [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">{row.original.trackingId}</span>
      ),
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.customer.name}</span>
      ),
    },
    {
      accessorKey: "pickupAddress",
      header: "Pickup",
      cell: ({ row }) => (
        <div className="flex items-start gap-2">
          <MapPin className="size-3 mt-0.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs line-clamp-1">{row.original.pickupAddress}</span>
        </div>
      ),
    },
    {
      accessorKey: "deliveryAddress",
      header: "Delivery",
      cell: ({ row }) => (
        <div className="flex items-start gap-2">
          <MapPin className="size-3 mt-0.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs line-clamp-1">{row.original.deliveryAddress}</span>
        </div>
      ),
    },
    {
      accessorKey: "districtFrom",
      header: "Route",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.districtFrom} → {row.original.districtTo}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<ParcelStatus>();
        const statusMap: Record<ParcelStatus, "success" | "warning" | "destructive" | "default"> = {
          REQUESTED: "default",
          ASSIGNED: "warning",
          PICKED: "warning",
          IN_TRANSIT: "warning",
          DELIVERED: "success",
          CANCELLED: "destructive",
        };
        return (
          <StatusBadge status={statusMap[status] ?? "default"} variant="default">
            {status}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => (
        <span className="font-medium">৳{getValue<number>().toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "isPaid",
      header: "Paid",
      cell: ({ getValue }) => {
        const isPaid = getValue<boolean>();
        return (
          <StatusBadge status={isPaid ? "success" : "warning"} variant="outline">
            {isPaid ? "Yes" : "No"}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "rider",
      header: "Rider",
      cell: ({ getValue }) => {
        const rider = getValue<AdminParcel["rider"]>();
        return rider ? (
          <span className="text-sm">{rider.user.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(getValue<string>()), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const parcel = row.original;
        const actions = [
          {
            label: "View Details",
            icon: <Eye className="size-4" />,
            onClick: () => onView(parcel),
          },
        ];

        if (!parcel.rider) {
          actions.push({
            label: "Assign Rider",
            icon: <UserCheck className="size-4" />,
            onClick: () => onAssignRider(parcel),
          });
        }

        actions.push({
          label: "Update Status",
          icon: <AlertTriangle className="size-4" />,
          onClick: () => onUpdateStatus(parcel),
        });

        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminParcelsTable() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParcelStatus | "ALL">("ALL");
  const [selectedParcelForRider, setSelectedParcelForRider] = useState<AdminParcel | null>(null);
  const [selectedParcelForStatus, setSelectedParcelForStatus] = useState<AdminParcel | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [newStatus, setNewStatus] = useState<ParcelStatus>("REQUESTED");

  const { data, isLoading } = useAdminParcels({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const assignRiderMutation = useAssignRider();
  const updateStatusMutation = useUpdateParcelStatus();

  const handleView = (parcel: AdminParcel) => {
    router.push(`/admin-dashboard/parcels/${parcel.id}`);
  };

  const handleAssignRider = (parcel: AdminParcel) => {
    setSelectedParcelForRider(parcel);
    setSelectedRiderId("");
  };

  const handleUpdateStatus = (parcel: AdminParcel) => {
    setSelectedParcelForStatus(parcel);
    setNewStatus(parcel.status);
  };

  const handleConfirmAssign = () => {
    if (selectedParcelForRider && selectedRiderId) {
      assignRiderMutation.mutate(
        { id: selectedParcelForRider.id, params: { riderId: selectedRiderId } },
        {
          onSuccess: () => {
            setSelectedParcelForRider(null);
            setSelectedRiderId("");
          },
        }
      );
    }
  };

  const handleConfirmStatus = () => {
    if (selectedParcelForStatus) {
      updateStatusMutation.mutate(
        { id: selectedParcelForStatus.id, params: { status: newStatus } },
        {
          onSuccess: () => {
            setSelectedParcelForStatus(null);
          },
        }
      );
    }
  };

  const columns = getParcelColumns(handleView, handleAssignRider, handleUpdateStatus);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <>
      <div className="space-y-3">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearch("")}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value: ParcelStatus | "ALL") => setStatusFilter(value)}
            >
              <SelectTrigger className="!h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="REQUESTED">Requested</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="PICKED">Picked</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(search || statusFilter !== "ALL") && (
            <Button variant="secondary" size="sm" onClick={resetFilters} className="h-9">
              Reset
            </Button>
          )}
        </div>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No parcels found."
          pagination={{
            state: pagination,
            onChange: setPagination,
            pageCount: data?.meta?.totalPages,
            totalItems: data?.meta?.total,
          }}
        />
      </div>

      {/* Assign Rider Dialog */}
      <Dialog open={!!selectedParcelForRider} onOpenChange={(open) => !open && setSelectedParcelForRider(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Rider</DialogTitle>
            <DialogDescription>
              Assign a rider to parcel {selectedParcelForRider?.trackingId}
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
              onClick={() => setSelectedParcelForRider(null)}
              disabled={assignRiderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAssign}
              disabled={assignRiderMutation.isPending || !selectedRiderId}
            >
              {assignRiderMutation.isPending ? "Assigning..." : "Assign Rider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedParcelForStatus} onOpenChange={(open) => !open && setSelectedParcelForStatus(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Parcel Status</DialogTitle>
            <DialogDescription>
              Change the status for parcel {selectedParcelForStatus?.trackingId}
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
              onClick={() => setSelectedParcelForStatus(null)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatus}
              disabled={updateStatusMutation.isPending || newStatus === selectedParcelForStatus?.status}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

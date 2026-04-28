"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Eye, XCircle, CreditCard } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useParcels, useCancelParcel, type Parcel } from "@/hooks/use-parcels";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { cn } from "@/lib/utils";
import { PaymentModal } from "./payment-modal";
import { CancelParcelDialog } from "./cancel-parcel-dialog";

// ─── Column definitions ───────────────────────────────────────────────────────

const getColumns = (onCancel: (parcel: Parcel) => void, onPay: (parcel: Parcel) => void, onView: (parcel: Parcel) => void): ColumnDef<Parcel>[] => [
  {
    accessorKey: "trackingId",
    header: "Tracking ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.original.trackingId}</span>
    ),
  },
  {
    accessorKey: "pickupAddress",
    header: "Pickup",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.pickupAddress}</span>
    ),
  },
  {
    accessorKey: "deliveryAddress",
    header: "Delivery",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.deliveryAddress}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">৳ {row.original.price.toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusMap: Record<string, { status: "success" | "warning" | "error" | "default" }> = {
        REQUESTED: { status: "default" },
        ASSIGNED: { status: "warning" },
        PICKED: { status: "warning" },
        IN_TRANSIT: { status: "warning" },
        DELIVERED: { status: "success" },
        CANCELLED: { status: "error" },
      };
      return (
        <StatusBadge status={statusMap[status]?.status ?? "default"} variant="default">
          {status}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ getValue }) => {
      const isPaid = getValue<boolean>();
      return (
        <StatusBadge status={isPaid ? "success" : "default"} variant="outline">
          {isPaid ? "Yes" : "No"}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(getValue<string>()).toLocaleDateString("en-BD", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
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

      if (parcel.status === "REQUESTED") {
        actions.push({
          label: "Cancel Parcel",
          icon: <XCircle className="size-4" />,
          onClick: () => onCancel(parcel),
        });
      }

      if (!parcel.isPaid) {
        actions.push({
          label: "Pay Now",
          icon: <CreditCard className="size-4" />,
          onClick: () => onPay(parcel),
        });
      }

      return <TableActionDropdown actions={actions} />;
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ParcelsTable() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [status, setStatus] = useState<
    "REQUESTED" | "ASSIGNED" | "PICKED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "ALL"
  >("ALL");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedParcelForPayment, setSelectedParcelForPayment] = useState<Parcel | null>(null);
  const [selectedParcelForCancel, setSelectedParcelForCancel] = useState<Parcel | null>(null);

  const { data, isLoading } = useParcels({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const cancelParcelMutation = useCancelParcel(() => {
    setSelectedParcelForCancel(null);
  });

  const handleCancel = (parcel: Parcel) => {
    setSelectedParcelForCancel(parcel);
  };

  const handleConfirmCancel = (parcel: Parcel) => {
    cancelParcelMutation.mutate({ id: parcel.id });
  };

  const handlePay = (parcel: Parcel) => {
    setSelectedParcelForPayment(parcel);
  };

  const handleView = (parcel: Parcel) => {
    router.push(`/dashboard/parcels/${parcel.id}`);
  };

  const columns = getColumns(handleCancel, handlePay, handleView);

  const resetFilters = () => {
    setStatus("ALL");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <>
      <div className="space-y-3">
        {/* Custom Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="w-auto">
            <Select
              value={status}
              onValueChange={(value: typeof status) => setStatus(value)}
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

          {/* Date Range Picker */}
          <div className="w-50">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) =>
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset Button */}
          {(status !== "ALL" || dateRange.from) && (
            <Button variant="secondary" size="sm" onClick={resetFilters} className="h-9">
              <X className="mr-2 size-4" />
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

      {selectedParcelForPayment && (
        <PaymentModal
          parcel={selectedParcelForPayment}
          open={!!selectedParcelForPayment}
          onOpenChange={(open) => !open && setSelectedParcelForPayment(null)}
        />
      )}

      {selectedParcelForCancel && (
        <CancelParcelDialog
          parcel={selectedParcelForCancel}
          open={!!selectedParcelForCancel}
          onOpenChange={(open) => !open && setSelectedParcelForCancel(null)}
          onConfirm={handleConfirmCancel}
          isCancelling={cancelParcelMutation.isPending}
        />
      )}
    </>
  );
}

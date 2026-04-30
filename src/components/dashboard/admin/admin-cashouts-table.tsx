"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useAdminCashouts, useUpdateCashoutStatus, type AdminCashout } from "@/hooks/use-admin-cashouts";
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
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import type { CashoutStatus } from "@/services/admin.server";
import { format } from "date-fns";

// ─── Column definitions ───────────────────────────────────────────────────────

const getCashoutColumns = (
  onUpdateStatus: (cashout: AdminCashout) => void
): ColumnDef<AdminCashout>[] => [
    {
      accessorKey: "rider.user.name",
      header: "Rider",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.rider.user.name}</span>
      ),
    },
    {
      accessorKey: "rider.user.email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.rider.user.email}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="font-medium">৳{getValue<number>().toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<CashoutStatus>();
        const statusMap: Record<CashoutStatus, "success" | "warning" | "destructive" | "default"> = {
          PENDING: "warning",
          APPROVED: "success",
          REJECTED: "destructive",
          PAID: "default",
        };
        const statusIcons: Record<CashoutStatus, React.ReactNode> = {
          PENDING: <Clock className="size-3" />,
          APPROVED: <CheckCircle className="size-3" />,
          REJECTED: <XCircle className="size-3" />,
          PAID: <DollarSign className="size-3" />,
        };
        return (
          <StatusBadge status={statusMap[status] ?? "default"} variant="default">
            <span className="flex items-center gap-1">
              {statusIcons[status]}
              {status}
            </span>
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "requestedAt",
      header: "Requested",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(getValue<string>()), "dd MMM yyyy, HH:mm")}
        </span>
      ),
    },
    {
      accessorKey: "processedAt",
      header: "Processed",
      cell: ({ getValue }) => {
        const processedAt = getValue<string | null>();
        return processedAt ? (
          <span className="text-xs text-muted-foreground">
            {format(new Date(processedAt), "dd MMM yyyy, HH:mm")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const cashout = row.original;
        const actions = [
          {
            label: "Update Status",
            icon: <CheckCircle className="size-4" />,
            onClick: () => onUpdateStatus(cashout),
          },
        ];

        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminCashoutsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState<CashoutStatus | "ALL">("ALL");
  const [selectedCashout, setSelectedCashout] = useState<AdminCashout | null>(null);
  const [newStatus, setNewStatus] = useState<CashoutStatus>("PENDING");

  const { data, isLoading } = useAdminCashouts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter,
  });

  const updateCashoutMutation = useUpdateCashoutStatus();

  const handleUpdateStatus = (cashout: AdminCashout) => {
    setSelectedCashout(cashout);
    setNewStatus(cashout.status);
  };

  const handleConfirmStatus = () => {
    if (selectedCashout) {
      updateCashoutMutation.mutate(
        { id: selectedCashout.id, params: { status: newStatus } },
        {
          onSuccess: () => {
            setSelectedCashout(null);
          },
        }
      );
    }
  };

  const columns = getCashoutColumns(handleUpdateStatus);

  const resetFilters = () => {
    setStatusFilter("ALL");
  };

  return (
    <>
      <div className="space-y-3">
        {/* Filter Toolbar */}
        <div className="flex items-center gap-3">
          <div className="w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value: CashoutStatus | "ALL") => setStatusFilter(value)}
            >
              <SelectTrigger className="!h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statusFilter !== "ALL" && (
            <Button variant="secondary" size="sm" onClick={resetFilters} className="h-9">
              Reset
            </Button>
          )}
        </div>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No cashouts found."
          pagination={{
            state: pagination,
            onChange: setPagination,
            pageCount: data?.meta?.totalPages,
            totalItems: data?.meta?.total,
          }}
        />
      </div>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedCashout} onOpenChange={(open) => !open && setSelectedCashout(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Cashout Status</DialogTitle>
            <DialogDescription>
              Change the status for cashout request from {selectedCashout?.rider.user.name} (৳{selectedCashout?.amount?.toLocaleString()})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(value: CashoutStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedCashout(null)}
              disabled={updateCashoutMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatus}
              disabled={updateCashoutMutation.isPending || newStatus === selectedCashout?.status}
            >
              {updateCashoutMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

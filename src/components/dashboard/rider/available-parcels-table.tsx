"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useAvailableParcels } from "@/hooks/use-available-parcels";
import type { Parcel } from "@/services/parcel.service";
import { StatusBadge } from "@/components/shared/status-badge";
import { AcceptParcelModal } from "./accept-parcel-modal";
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { Check } from "lucide-react";

// ─── Column definitions ───────────────────────────────────────────────────────

const getColumns = (onAccept: (parcel: Parcel) => void): ColumnDef<Parcel>[] => [
    {
        accessorKey: "trackingId",
        header: "Tracking ID",
        meta: { filterVariant: "text", filterLabel: "Tracking ID" },
        cell: ({ getValue }) => (
            <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
        ),
    },
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.customer.name,
        meta: { filterVariant: "text", filterLabel: "Customer" },
        cell: ({ row }) => (
            <div className="space-y-0.5">
                <p className="text-sm font-medium leading-none">{row.original.customer.name}</p>
                <p className="text-xs text-muted-foreground">{row.original.customer.phone}</p>
            </div>
        ),
    },
    {
        accessorKey: "districtFrom",
        header: "From",
        meta: { filterVariant: "select", filterLabel: "From District" },
    },
    {
        accessorKey: "districtTo",
        header: "To",
        meta: { filterVariant: "select", filterLabel: "To District" },
    },
    {
        accessorKey: "pickupAddress",
        header: "Pickup Address",
        cell: ({ getValue }) => (
            <span className="max-w-45 truncate block text-sm">{getValue<string>()}</span>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        meta: { filterVariant: "range", filterLabel: "Price (BDT)" },
        cell: ({ getValue }) => (
            <span className="font-medium">৳ {getValue<number>().toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "isPaid",
        header: "Payment",
        meta: { filterVariant: "select", filterLabel: "Payment" },
        accessorFn: (row) => (row.isPaid ? "Paid" : "Unpaid"),
        cell: ({ getValue }) => {
            const paid = getValue<string>() === "Paid";
            return (
                <StatusBadge status={paid ? "success" : "warning"} variant={"default"}>
                    {paid ? "Paid" : "Unpaid"}
                </StatusBadge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Posted",
        cell: ({ getValue }) => (
            <span className="text-xs text-muted-foreground">
                {new Date(getValue<string>()).toLocaleDateString("en-BD", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
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
            return (
                <TableActionDropdown
                    actions={[
                        {
                            label: "Accept",
                            icon: <Check className="size-4" />,
                            onClick: () => onAccept(parcel),
                        },
                    ]}
                />
            );
        },
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AvailableParcelsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

    const { data, isLoading } = useAvailableParcels({
        page: pagination.pageIndex + 1, // API is 1-based
        limit: pagination.pageSize,
    });

    const columns = getColumns(setSelectedParcel);

    return (
        <>
            <DataTable
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No parcels available for pickup right now."
                pagination={{
                    state: pagination,
                    onChange: setPagination,
                    pageCount: data?.meta.totalPages,
                    totalItems: data?.meta.total,
                }}
            />
            <AcceptParcelModal
                parcel={selectedParcel}
                open={!!selectedParcel}
                onOpenChange={(open) => !open && setSelectedParcel(null)}
            />
        </>
    );
}

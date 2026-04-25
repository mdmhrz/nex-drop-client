"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { useAvailableParcels } from "@/hooks/use-available-parcels";
import type { Parcel } from "@/services/parcel.service";

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<Parcel>[] = [
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
                <Badge variant={paid ? "default" : "secondary"}>
                    {paid ? "Paid" : "Unpaid"}
                </Badge>
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
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AvailableParcelsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useAvailableParcels({
        page: pagination.pageIndex + 1, // API is 1-based
        limit: pagination.pageSize,
    });

    return (
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
    );
}

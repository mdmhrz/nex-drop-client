"use client";

import { useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useRiderRatings, type RatingWithDetails } from "@/hooks/use-ratings";
import { Star } from "lucide-react";

interface RiderRatingsTableProps {
    riderId: string;
}

function StarDisplay({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`size-3.5 ${s <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
            ))}
        </div>
    );
}

const columns: ColumnDef<RatingWithDetails>[] = [
    {
        accessorKey: "customer.name",
        header: "Customer",
        cell: ({ row }) => (
            <span className="font-medium text-sm">{row.original.customer?.name ?? "—"}</span>
        ),
    },
    {
        accessorKey: "parcel.trackingId",
        header: "Tracking ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.parcel?.trackingId ?? "—"}</span>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => <StarDisplay value={row.original.rating} />,
    },
    {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                {row.original.comment ?? <em className="text-xs">No comment</em>}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
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

export function RiderRatingsTable({ riderId }: RiderRatingsTableProps) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useRiderRatings(riderId, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    return (
        <DataTable
            data={data?.data ?? []}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No ratings yet."
            pagination={{
                state: pagination,
                onChange: setPagination,
                pageCount: data?.meta.totalPages,
                totalItems: data?.meta.total,
            }}
        />
    );
}

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useCashouts, type Cashout } from "@/hooks/use-cashouts";
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
import { cn } from "@/lib/utils";

// ─── Column definitions ───────────────────────────────────────────────────────

const getColumns = (): ColumnDef<Cashout>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs font-medium">{row.original.id.slice(0, 8)}</span>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <span className="font-medium text-green-600">৳ {row.original.amount.toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const status = getValue<string>();
            const statusMap: Record<string, { status: "success" | "warning" | "error" | "default" }> = {
                PENDING: { status: "warning" },
                APPROVED: { status: "success" },
                PAID: { status: "success" },
                REJECTED: { status: "error" },
            };
            return (
                <StatusBadge status={statusMap[status]?.status ?? "default"} variant="default">
                    {status}
                </StatusBadge>
            );
        },
    },
    {
        accessorKey: "requestedAt",
        header: "Requested At",
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
        accessorKey: "processedAt",
        header: "Processed At",
        cell: ({ getValue }) => {
            const value = getValue<string | null>();
            return value ? (
                <span className="text-xs text-muted-foreground">
                    {new Date(value).toLocaleDateString("en-BD", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            ) : (
                <span className="text-xs text-muted-foreground">-</span>
            );
        },
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface CashoutsTableProps {
    onRequestCashout: () => void;
}

export function CashoutsTable({ onRequestCashout }: CashoutsTableProps) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | "PAID" | "ALL">("ALL");
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    const { data, isLoading } = useCashouts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: status === "ALL" ? undefined : status,
        startDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    });

    const columns = getColumns();

    const resetFilters = () => {
        setStatus("ALL");
        setDateRange({ from: undefined, to: undefined });
    };

    return (
        <div className="space-y-3">
            {/* Custom Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="w-auto">
                    <Select value={status} onValueChange={(value: "PENDING" | "APPROVED" | "REJECTED" | "ALL") => setStatus(value)}>
                        <SelectTrigger className="!h-9">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>

                            <SelectItem value="REJECTED">Rejected</SelectItem>
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

                {/* Cashout Request Button */}
                <Button size="sm" onClick={onRequestCashout} className="h-9 ml-auto">
                    Request Cashout
                </Button>
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
    );
}

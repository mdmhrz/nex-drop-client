"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, SearchIcon, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useEarnings, type Earning } from "@/hooks/use-earnings";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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

const getColumns = (): ColumnDef<Earning>[] => [
    {
        accessorKey: "parcel.trackingId",
        header: "Tracking ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs font-medium">{row.original.parcel?.trackingId}</span>
        ),
    },
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => row.parcel?.customer?.name,
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <UserAvatar
                    name={row.original.parcel?.customer?.name ?? ""}
                    email={row.original.parcel?.customer?.email}
                />
                <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{row.original.parcel?.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.parcel?.customer?.email}</p>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "parcel.price",
        header: "Parcel Price",
        cell: ({ row }) => (
            <span className="font-medium">৳ {row.original.parcel?.price?.toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "percentage",
        header: "Commission %",
        cell: ({ getValue }) => (
            <span className="font-medium">{getValue<number>()}%</span>
        ),
    },
    {
        accessorKey: "amount",
        header: "Earning Amount",
        cell: ({ getValue }) => (
            <span className="font-medium text-green-600">৳ {getValue<number>().toFixed(2)}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const status = getValue<string>();
            return (
                <StatusBadge status={status === "PAID" ? "success" : "warning"} variant="default">
                    {status}
                </StatusBadge>
            );
        },
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

// ─── Component ────────────────────────────────────────────────────────────────

export function EarningsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"PENDING" | "PAID" | "ALL">("ALL");
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    const { data, isLoading } = useEarnings({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
        startDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    });

    const columns = getColumns();

    const resetFilters = () => {
        setSearch("");
        setStatus("ALL");
        setDateRange({ from: undefined, to: undefined });
    };

    return (
        <div className="space-y-3">
            {/* Custom Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by tracking ID..."
                        className="h-9 pl-9"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-auto">
                    <Select value={status} onValueChange={(value: "PENDING" | "PAID" | "ALL") => setStatus(value)}>
                        <SelectTrigger className="h-9!">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
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
                {(search || status !== "ALL" || dateRange.from) && (
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
                emptyMessage="No earnings found."
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

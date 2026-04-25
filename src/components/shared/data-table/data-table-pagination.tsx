"use client";

import { useId } from "react";
import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import type { DataTablePaginationProps } from "./types";

const PAGE_SIZES = [10, 25, 50, 100];

interface Props {
    pagination: DataTablePaginationProps;
    totalPages: number;
}

export function DataTablePagination({ pagination, totalPages }: Props) {
    const id = useId();
    const { state, onChange, totalItems } = pagination;
    const { pageIndex, pageSize } = state;

    const from = pageIndex * pageSize + 1;
    const to = Math.min(from + pageSize - 1, totalItems ?? (pageIndex + 1) * pageSize);
    const pages = pagination.pageCount ?? totalPages;
    const canPrev = pageIndex > 0;
    const canNext = pageIndex < pages - 1;

    function goTo(index: number) {
        onChange({ pageIndex: index, pageSize });
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <Label htmlFor={id} className="text-xs text-muted-foreground whitespace-nowrap">
                    Rows per page
                </Label>
                <Select
                    value={String(pageSize)}
                    onValueChange={(val) => onChange({ pageIndex: 0, pageSize: Number(val) })}
                >
                    <SelectTrigger id={id} className="h-8 w-20 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZES.map((s) => (
                            <SelectItem key={s} value={String(s)} className="text-xs">
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Counter */}
            <p className="grow text-end text-xs text-muted-foreground" aria-live="polite">
                {totalItems !== undefined ? (
                    <>
                        <span className="font-medium text-foreground">
                            {from}–{to}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-foreground">{totalItems}</span>
                    </>
                ) : (
                    <>
                        Page{" "}
                        <span className="font-medium text-foreground">{pageIndex + 1}</span> of{" "}
                        <span className="font-medium text-foreground">{pages}</span>
                    </>
                )}
            </p>

            {/* Navigation */}
            <Pagination>
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => goTo(0)}
                            disabled={!canPrev}
                            aria-label="First page"
                        >
                            <ChevronFirstIcon className="size-3.5" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => goTo(pageIndex - 1)}
                            disabled={!canPrev}
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon className="size-3.5" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => goTo(pageIndex + 1)}
                            disabled={!canNext}
                            aria-label="Next page"
                        >
                            <ChevronRightIcon className="size-3.5" />
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => goTo(pages - 1)}
                            disabled={!canNext}
                            aria-label="Last page"
                        >
                            <ChevronLastIcon className="size-3.5" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

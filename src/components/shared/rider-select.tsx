"use client";

import { useState, useMemo } from "react";
import { useAdminRiderApplications } from "@/hooks/use-admin-rider-applications";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronDown } from "lucide-react";

interface RiderSelectProps {
    value: string;
    onValueChange: (riderId: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function RiderSelect({
    value,
    onValueChange,
    disabled = false,
    placeholder = "Select a rider...",
}: RiderSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch active riders only
    const { data, isLoading } = useAdminRiderApplications({
        accountStatus: "ACTIVE",
        limit: 100, // Fetch all active riders
    });

    const riders = useMemo(() => data?.data ?? [], [data?.data]);

    // Filter riders based on search query
    const filteredRiders = useMemo(() => {
        if (!searchQuery) return riders;

        const query = searchQuery.toLowerCase();
        return riders.filter(
            (rider) =>
                rider.user.name.toLowerCase().includes(query) ||
                rider.user.email.toLowerCase().includes(query)
        );
    }, [riders, searchQuery]);

    const selectedRider = riders.find((r) => r.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    <span className="truncate text-sm">
                        {selectedRider
                            ? `${selectedRider.user.name} - ${selectedRider.user.email}`
                            : placeholder}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        disabled={isLoading}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="space-y-2 p-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : filteredRiders.length === 0 ? (
                            <CommandEmpty>
                                {searchQuery
                                    ? "No riders found matching your search."
                                    : "No active riders available."}
                            </CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredRiders.map((rider) => (
                                    <CommandItem
                                        key={rider.id}
                                        value={rider.id}
                                        onSelect={(currentValue) => {
                                            onValueChange(
                                                currentValue === value ? "" : currentValue
                                            );
                                            setOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className="flex cursor-pointer items-center justify-between py-2"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-sm">
                                                {rider.user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {rider.user.email}
                                            </span>
                                        </div>
                                        {value === rider.id && (
                                            <Check className="h-4 w-4 text-green-600" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

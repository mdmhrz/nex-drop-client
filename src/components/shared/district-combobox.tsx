"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

interface DistrictComboboxProps {
    value: string;
    onChange: (value: string) => void;
    districts: string[];
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
}

export function DistrictCombobox({
    value,
    onChange,
    districts,
    placeholder = "Select district",
    error = false,
    disabled = false,
}: DistrictComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground",
                        error && "border-destructive"
                    )}
                >
                    {value || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command >
                    <CommandInput placeholder="Search district..." />
                    <CommandList>
                        <CommandEmpty>No district found.</CommandEmpty>
                        <CommandGroup>
                            {districts.map((district) => (
                                <CommandItem
                                    key={district}
                                    value={district}
                                    onSelect={(current) => {
                                        onChange(current === value ? "" : current);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === district ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {district}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export interface TableAction {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}

interface TableActionDropdownProps {
    actions: TableAction[];
}

export function TableActionDropdown({ actions }: TableActionDropdownProps) {
    return (
        <div className="flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 border border-border hover:bg-muted transition-colors"
                    >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-48 p-1 border-border"
                >
                    {actions.map((action, index) => (
                        <DropdownMenuItem
                            key={index}
                            className="cursor-pointer gap-2 px-2 py-2 hover:bg-muted transition-colors"
                            onClick={action.onClick}
                            disabled={action.disabled}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

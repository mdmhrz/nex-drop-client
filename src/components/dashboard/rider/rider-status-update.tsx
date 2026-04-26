"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateRiderStatus, type UpdateStatusParams } from "@/services/rider.client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";

type RiderStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

interface RiderStatusUpdateProps {
    currentStatus: RiderStatus;
}

const statusLabels: Record<RiderStatus, string> = {
    AVAILABLE: "Available",
    BUSY: "Busy",
    OFFLINE: "Offline",
};

export function RiderStatusUpdate({ currentStatus }: RiderStatusUpdateProps) {
    const [open, openDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<RiderStatus | null>(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (params: UpdateStatusParams) => updateRiderStatus(params),
        onSuccess: (response) => {
            toast.success(response?.message || "Status updated successfully");
            queryClient.invalidateQueries({ queryKey: RIDER_PROFILE_KEY });
            openDialog(false);
            setSelectedStatus(null);
        },
        onError: (error: unknown) => {
            const errorMessage = (error as { message?: string })?.message || "Failed to update status";
            toast.error(errorMessage);
        },
    });

    const handleStatusSelect = (status: RiderStatus) => {
        if (status === "OFFLINE") {
            setSelectedStatus(status);
            openDialog(true);
        } else {
            mutation.mutate({ currentStatus: status });
        }
    };

    const handleConfirmOffline = () => {
        if (selectedStatus) {
            mutation.mutate({ currentStatus: selectedStatus });
        }
    };

    const statuses: RiderStatus[] = ["AVAILABLE", "BUSY", "OFFLINE"];

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" className="gap-2 py-4 px-6">
                        <RefreshCw className="size-4" />
                        Update Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {statuses.map((status) => (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusSelect(status)}
                            disabled={status === currentStatus}
                        >
                            {statusLabels[status]}
                            {status === currentStatus && " (Current)"}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={openDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Go Offline?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will no longer be available to be assigned any parcels. Are you sure you want to go offline?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={mutation.isPending}
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmOffline();
                            }}
                        >
                            {mutation.isPending ? "Updating..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

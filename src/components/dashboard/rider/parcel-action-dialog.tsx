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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { parcelService, type ParcelActionParams } from "@/services/parcel.service";
import { ASSIGNED_PARCELS_KEY } from "@/hooks/use-assigned-parcels";
import { toast } from "sonner";
import type { Parcel } from "@/services/parcel.service";

type ParcelAction = "pick" | "deliver";

interface ParcelActionDialogProps {
    parcel: Parcel | null;
    action: ParcelAction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const actionConfig = {
    pick: {
        title: "Mark as Picked",
        description: (trackingId: string) =>
            `Confirm that you have picked up parcel ${trackingId} from the sender. This will change the status to "In Transit".`,
        buttonText: "Confirm Pickup",
        apiCall: parcelService.pickParcel,
    },
    deliver: {
        title: "Mark as Delivered",
        description: (trackingId: string) =>
            `Confirm that you have delivered parcel ${trackingId} to the recipient. This will complete the delivery.`,
        buttonText: "Confirm Delivery",
        apiCall: parcelService.deliverParcel,
    },
};

export function ParcelActionDialog({ parcel, action, open, onOpenChange }: ParcelActionDialogProps) {
    const queryClient = useQueryClient();
    const [note, setNote] = useState("");

    const config = action ? actionConfig[action] : null;

    const mutation = useMutation({
        mutationFn: ({ id, params }: { id: string; params?: ParcelActionParams }) => {
            if (!config) throw new Error("No action configured");
            return config.apiCall(id, params);
        },
        onSuccess: (response) => {
            toast.success(response.message || "Action completed successfully");
            queryClient.invalidateQueries({ queryKey: [ASSIGNED_PARCELS_KEY] });
            setNote("");
            onOpenChange(false);
        },
        onError: (error: unknown) => {
            const errorMessage = (error as { message?: string })?.message || "Failed to complete action";
            toast.error(errorMessage);
        },
    });

    const handleConfirm = () => {
        if (!parcel || !config) return;
        mutation.mutate({ id: parcel.id, params: { note: note || undefined } });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setNote("");
        }
        onOpenChange(newOpen);
    };

    if (!config || !parcel) return null;

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{config.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {config.description(parcel.trackingId)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2 py-4">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                        id="note"
                        placeholder="Add any notes about this action..."
                        className="resize-none"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Processing..." : config.buttonText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

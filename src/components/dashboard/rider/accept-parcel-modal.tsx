"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { parcelService, type AcceptParcelParams } from "@/services/parcel.service";
import { AVAILABLE_PARCELS_KEY } from "@/hooks/use-available-parcels";
import { toast } from "sonner";
import type { Parcel } from "@/services/parcel.service";
import { SubmitButton } from "@/components/shared/submit-button";
import { Check } from "lucide-react";

const acceptParcelSchema = z.object({
    note: z.string().optional(),
});

type AcceptParcelFormData = z.infer<typeof acceptParcelSchema>;

interface AcceptParcelModalProps {
    parcel: Parcel | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AcceptParcelModal({ parcel, open, onOpenChange }: AcceptParcelModalProps) {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AcceptParcelFormData>({
        resolver: zodResolver(acceptParcelSchema),
        defaultValues: {
            note: "",
        },
    });

    const mutation = useMutation({
        mutationFn: ({ id, params }: { id: string; params?: AcceptParcelParams }) =>
            parcelService.acceptParcel(id, params),
        onSuccess: (response) => {
            toast.success(response.message || "Parcel accepted successfully");
            queryClient.invalidateQueries({ queryKey: [AVAILABLE_PARCELS_KEY] });
            reset();
            onOpenChange(false);
        },
        onError: (error: unknown) => {
            const errorMessage = (error as { message?: string })?.message || "Failed to accept parcel";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data: AcceptParcelFormData) => {
        if (!parcel) return;
        mutation.mutate({ id: parcel.id, params: data });
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Accept Parcel</DialogTitle>
                    <DialogDescription>
                        {parcel && (
                            <>
                                You are about to accept parcel <span className="font-mono font-medium">{parcel.trackingId}</span>.
                                This will assign the parcel to you.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Textarea
                                id="note"
                                placeholder="Add any notes about this delivery..."
                                className="resize-none"
                                rows={3}
                                {...register("note")}
                            />
                            {errors.note && (
                                <p className="text-sm text-destructive">{errors.note.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <SubmitButton
                            isPending={mutation.isPending}
                            pendingLabel="Accepting..."
                            icon={Check}
                            type="submit"
                        >
                            Accept Parcel
                        </SubmitButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

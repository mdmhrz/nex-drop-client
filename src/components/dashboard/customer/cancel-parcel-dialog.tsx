"use client";

import { type Parcel } from "@/hooks/use-parcels";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CancelParcelDialogProps {
  parcel: Parcel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (parcel: Parcel) => void;
  isCancelling?: boolean;
}

export function CancelParcelDialog({
  parcel,
  open,
  onOpenChange,
  onConfirm,
  isCancelling = false,
}: CancelParcelDialogProps) {
  if (!parcel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Cancel Parcel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel parcel {parcel.trackingId}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tracking ID:</span>
              <span className="font-medium">{parcel.trackingId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pickup:</span>
              <span className="font-medium">{parcel.pickupAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery:</span>
              <span className="font-medium">{parcel.deliveryAddress}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
              <span>Amount:</span>
              <span>৳ {parcel.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCancelling}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(parcel)}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Parcel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { type Address } from "@/hooks/use-addresses";
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
import { AlertTriangle } from "lucide-react";

interface DeleteAddressDialogProps {
  address: Address | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: Address) => void;
  isDeleting?: boolean;
}

export function DeleteAddressDialog({
  address,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteAddressDialogProps) {
  if (!address) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Delete Address
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the address <span className="font-semibold">{address.label}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Label:</span>
              <span className="font-medium">{address.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">{address.address}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">District:</span>
              <span className="font-medium">{address.district}</span>
            </div>
            {address.phone && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{address.phone}</span>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(address)}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Address"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

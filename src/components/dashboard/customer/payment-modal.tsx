"use client";

import { type Parcel, useInitiatePayment, type PaymentMethod } from "@/hooks/use-parcels";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
  parcel: Parcel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ parcel, open, onOpenChange }: PaymentModalProps) {
  const initiatePayment = useInitiatePayment();

  const handlePayment = (paymentMethod: PaymentMethod) => {
    initiatePayment.mutate({
      id: parcel.id,
      params: { paymentMethod },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the payment for parcel {parcel.trackingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Parcel Details */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tracking ID:</span>
              <span className="font-medium">{parcel.trackingId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{parcel.pickupAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">{parcel.deliveryAddress}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
              <span>Total Amount:</span>
              <span className="text-lg">৳ {parcel.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Loading State */}
          {initiatePayment.isPending && (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span>Initiating payment...</span>
            </div>
          )}

          {/* Payment Options */}
          {!initiatePayment.isPending && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Image src="/payment-methods/stripe.png" alt="Stripe" width={48} height={48} className="h-12 w-auto" />
                  </div>
                  <CardTitle className="text-center text-sm">Stripe</CardTitle>
                  <CardDescription className="text-center text-xs">
                    Pay with credit card
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handlePayment("STRIPE")}
                    disabled={initiatePayment.isPending}
                  >
                    Pay with Stripe
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Image src="/payment-methods/sslcommerz.png" alt="SSLCommerz" width={48} height={48} className="h-12 w-auto" />
                  </div>
                  <CardTitle className="text-center text-sm">SSLCommerz</CardTitle>
                  <CardDescription className="text-center text-xs">
                    Pay with mobile banking
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => handlePayment("SSLCOMMERZ")}
                    disabled={initiatePayment.isPending}
                  >
                    Pay with SSLCommerz
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

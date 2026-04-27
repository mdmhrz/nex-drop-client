"use client";

import { useState } from "react";
import { useCashoutRequest } from "@/hooks/use-cashouts";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CashoutRequestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableAmount: number;
}

export function CashoutRequestModal({ open, onOpenChange, availableAmount }: CashoutRequestModalProps) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const cashoutRequest = useCashoutRequest();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const amountValue = parseFloat(amount);

        if (isNaN(amountValue) || amountValue <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (amountValue > availableAmount) {
            setError("Amount cannot exceed available balance");
            return;
        }

        if (amountValue < 1) {
            setError("Minimum amount is 1");
            return;
        }

        if (amountValue > 100000) {
            setError("Maximum amount is 100,000");
            return;
        }

        try {
            await cashoutRequest.mutateAsync(amountValue);
            onOpenChange(false);
            setAmount("");
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to request cashout");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Cashout</DialogTitle>
                    <DialogDescription>
                        Enter the amount you want to withdraw from your available earnings.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="available">Available Balance</Label>
                            <div className="text-2xl font-semibold text-green-600">
                                ৳ {availableAmount.toFixed(2)}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                max="100000"
                                step="0.01"
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={cashoutRequest.isPending}>
                            {cashoutRequest.isPending ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

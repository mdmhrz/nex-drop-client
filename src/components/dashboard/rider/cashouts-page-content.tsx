"use client";

import { useState } from "react";
import { CashoutsTable } from "./cashouts-table";
import { CashoutRequestModal } from "./cashout-request-modal";

interface CashoutsPageContentProps {
    initialAvailableAmount: number;
}

export function CashoutsPageContent({ initialAvailableAmount }: CashoutsPageContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cashouts</h1>
                    <p className="text-muted-foreground">Manage your cashout requests</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-semibold text-green-600">
                        ৳ {initialAvailableAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <CashoutsTable
                onRequestCashout={() => setIsModalOpen(true)}
            />

            <CashoutRequestModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                availableAmount={initialAvailableAmount}
            />
        </div>
    );
}

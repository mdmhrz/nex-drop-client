"use client";

import { EarningsTable } from "@/components/dashboard/rider/earnings-table";

export function EarningsPageContent() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
                <p className="text-muted-foreground">View your earnings and cashout history.</p>
            </div>
            <EarningsTable />
        </div>
    );
}

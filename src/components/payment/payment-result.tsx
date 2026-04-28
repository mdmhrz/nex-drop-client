"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/shared/primary-button";

interface PaymentResultProps {
    status: "success" | "fail";
    title?: string;
    message?: string;
    details?: Record<string, string>;
    sessionId?: string | null;
}

export default function PaymentResult({
    status,
    title,
    message,
    details,
    sessionId,
}: PaymentResultProps) {
    const icon = status === "success" ? (
        <CheckCircle className="h-14 w-14 text-emerald-500" />
    ) : (
        <XCircle className="h-14 w-14 text-rose-600" />
    );

    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Transaction ID copied");
        } catch (err) {
            toast.error("Copy failed");
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-16 lg:mt-28 px-6">
            <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="flex items-center justify-center mb-4">{icon}</div>
                <h1 className="text-2xl font-semibold mb-2">{title}</h1>
                {message && <p className="text-sm text-muted-foreground mb-6">{message}</p>}

                {details && (
                    <div className="text-left my-4">
                        <dl className="grid grid-cols-1 gap-2">
                            {Object.entries(details).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between py-2 border-b">
                                    <dt className="text-xs text-muted-foreground">{k}</dt>
                                    <dd className="text-sm font-medium">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                {sessionId && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="text-sm text-muted-foreground">Transaction ID:</div>
                        <div className="font-mono text-sm">{sessionId}</div>
                        <button
                            aria-label="Copy transaction id"
                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
                            onClick={() => copyToClipboard(sessionId)}
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/dashboard/parcels">
                        <PrimaryButton>View Orders</PrimaryButton>
                    </Link>

                    <Link href="/contact">
                        <PrimaryButton>Contact Support</PrimaryButton>
                    </Link>

                    <Link href="/">
                        <PrimaryButton>Home</PrimaryButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}

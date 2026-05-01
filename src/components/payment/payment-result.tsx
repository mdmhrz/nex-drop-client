"use client";

import React from "react";
import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    Copy,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

    const isSuccess = status === "success";

    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Transaction ID copied");
        } catch {
            toast.error("Copy failed");
        }
    }

    return (
        <div className="min-h-[100dvh] pb-[env(safe-area-inset-bottom)]  bg-background flex items-center justify-center">
            <div className="container max-w-2xl mx-auto py-16">
                <Card className="shadow-sm">

                    {/* Header */}
                    <CardHeader className="items-center flex flex-col justify-center text-center  space-y-3">

                        <div className="flex items-ceter justify-center">
                            {isSuccess ? (
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                            ) : (
                                <XCircle className="h-12 w-12 text-destructive" />
                            )}
                        </div>

                        <CardTitle className="text-2xl">
                            {title || (isSuccess ? "Payment Successful" : "Payment Failed")}
                        </CardTitle>

                        {message && (
                            <CardDescription>{message}</CardDescription>
                        )}

                        <Badge variant={isSuccess ? "default" : "destructive"}>
                            {isSuccess ? "Success" : "Failed"}
                        </Badge>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="space-y-6">

                        {/* Details */}
                        {details && (
                            <div className="space-y-3">
                                {Object.entries(details).map(([k, v]) => (
                                    <div
                                        key={k}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-muted-foreground">{k}</span>
                                        <span className="font-medium">{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Session ID */}
                        {sessionId && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between gap-3 text-sm">

                                    <span className="text-muted-foreground">
                                        Transaction ID
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                            {sessionId}
                                        </code>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(sessionId)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">

                            <Link href="/dashboard/parcels">
                                <Button className="w-full sm:w-auto">
                                    View Orders
                                </Button>
                            </Link>

                            <Link href="/contact">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Contact Support
                                </Button>
                            </Link>

                            <Link href="/">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Back to Home
                                </Button>
                            </Link>

                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
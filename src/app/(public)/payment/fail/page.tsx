"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentResult from "@/components/payment/payment-result";

export default function PaymentFailPage() {
    const search = useSearchParams();
    const error = search.get("error");
    const sessionId = search.get("session_id");

    const title = "Payment failed";
    const message = error
        ? decodeURIComponent(error)
        : "We couldn't complete your payment. Please try again or contact support.";

    const details = sessionId ? { "Transaction ID": sessionId } : undefined;

    return (
        <PaymentResult
            status="fail"
            title={title}
            message={message}
            details={details}
            sessionId={sessionId}
        />
    );
}

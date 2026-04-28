"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentResult from "@/components/payment/payment-result";

export default function PaymentSuccessPage() {
    const search = useSearchParams();
    const sessionId = search.get("session_id");

    const title = "Payment successful";
    const message = sessionId
        ? "Thank you — your payment was received. A receipt will be emailed to you shortly."
        : "Thank you — your payment appears successful. If you don't see a receipt, please contact support.";

    const details = sessionId ? { "Transaction ID": sessionId } : undefined;

    return (
        <PaymentResult
            status="success"
            title={title}
            message={message}
            details={details}
            sessionId={sessionId}
        />
    );
}

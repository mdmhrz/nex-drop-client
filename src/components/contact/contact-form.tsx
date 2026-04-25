"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const SUBJECTS = [
    "General Inquiry",
    "Parcel Tracking Issue",
    "Delivery Complaint",
    "Partnership / Merchant",
    "Become a Rider",
    "Billing & Payment",
    "Other",
];

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Placeholder: replace with actual API call
        await new Promise((r) => setTimeout(r, 1200));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Card className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Send className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                        Message sent!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        We&apos;ll get back to you within 24 hours.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="mt-2 rounded-full"
                    onClick={() => setSubmitted(false)}
                >
                    Send another message
                </Button>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Your full name"
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select name="subject" required>
                            <SelectTrigger id="subject" className="w-full">
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUBJECTS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Describe your issue or question in detail…"
                                required
                                rows={5}
                                className="pl-9 resize-none"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Sending…"
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

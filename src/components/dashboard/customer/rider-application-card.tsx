"use client";

import { useRiderProfile } from "@/hooks/use-rider-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Bike, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const accountStatusConfig: Record<string, "success" | "warning" | "destructive" | "info"> = {
    ACTIVE: "success",
    PENDING: "warning",
    SUSPENDED: "destructive",
    REJECTED: "destructive",
};

export function RiderApplicationCard() {
    const { data, isLoading, isError } = useRiderProfile();

    // Don't render anything while loading, or if the user has no application
    if (isLoading || isError || !data?.data) return null;

    const application = data.data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bike className="size-5" />
                    Rider Application
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application Status</p>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={accountStatusConfig[application.accountStatus] || "info"}>
                            {application.accountStatus}
                        </StatusBadge>
                        {application.accountStatus === "PENDING" && (
                            <p className="text-xs text-muted-foreground">Under review — usually takes up to 24 hours.</p>
                        )}
                        {application.accountStatus === "ACTIVE" && (
                            <p className="text-xs text-muted-foreground">You are an active rider.</p>
                        )}
                        {application.accountStatus === "REJECTED" && (
                            <p className="text-xs text-muted-foreground">Your application was not approved.</p>
                        )}
                        {application.accountStatus === "SUSPENDED" && (
                            <p className="text-xs text-muted-foreground">Your rider account has been suspended.</p>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        {application.district}
                    </p>
                </div>

                <Separator />

                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        {new Date(application.createdAt).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>

                {application.accountStatus === "REJECTED" && (
                    <>
                        <Separator />
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/be-a-rider">
                                Re-apply <ArrowRight className="size-4 ml-1" />
                            </Link>
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

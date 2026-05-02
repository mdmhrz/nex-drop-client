"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    useUpdateRiderAccountStatus,
    type RiderApplication,
} from "@/hooks/use-admin-rider-applications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    User as UserIcon,
    Mail,
    MapPin,
    Star,
    Package,
    Calendar,
    CheckCircle,
    XCircle,
    PauseCircle,
    Phone,
    ShieldCheck,
    RotateCcw,
    ChevronDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { RiderAccountStatus } from "@/services/admin.server";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAllRiderApplicationsClient } from "@/services/admin.service";

// Fetch a single application by riderId using the list endpoint
function useRiderApplication(riderId: string) {
    return useQuery({
        queryKey: ["admin", "rider-applications", riderId],
        queryFn: async (): Promise<RiderApplication | null> => {
            const result = await getAllRiderApplicationsClient({ limit: 1000 });
            return result.data.find((a) => a.id === riderId) ?? null;
        },
        enabled: !!riderId,
        staleTime: 0,
    });
}

// ─── Alert dialog config ───────────────────────────────────────────────────────

const ACTION_CONFIG: Record<RiderAccountStatus, {
    title: string;
    description: (name: string) => string;
    actionLabel: string;
    isDestructive: boolean;
}> = {
    ACTIVE: {
        title: "Approve Rider",
        description: (name) =>
            `Approve ${name}? They will be promoted to an active rider and their role will be updated to Rider.`,
        actionLabel: "Approve",
        isDestructive: false,
    },
    REJECTED: {
        title: "Reject Application",
        description: (name) =>
            `Reject ${name}'s application? Their rider account status will be set to Rejected.`,
        actionLabel: "Reject",
        isDestructive: true,
    },
    SUSPENDED: {
        title: "Suspend Rider",
        description: (name) =>
            `Suspend ${name}? They will not be able to accept new deliveries until reactivated.`,
        actionLabel: "Suspend",
        isDestructive: true,
    },
    PENDING: {
        title: "Reset to Pending",
        description: (name) =>
            `Reset ${name}'s application to Pending? This will reopen it for review.`,
        actionLabel: "Set Pending",
        isDestructive: false,
    },
};

const ACCOUNT_STATUS_VARIANT: Record<RiderAccountStatus, "success" | "warning" | "destructive" | "default"> = {
    ACTIVE: "success",
    PENDING: "warning",
    SUSPENDED: "warning",
    REJECTED: "destructive",
};

export function AdminRiderApplicationDetailsContent({ riderId }: { riderId: string }) {
    const router = useRouter();
    const { data: application, isLoading } = useRiderApplication(riderId);
    const [pendingStatus, setPendingStatus] = useState<RiderAccountStatus | null>(null);

    const updateStatusMutation = useUpdateRiderAccountStatus();

    const handleConfirm = () => {
        if (!pendingStatus) return;
        updateStatusMutation.mutate(
            { riderId, params: { accountStatus: pendingStatus } },
            { onSuccess: () => setPendingStatus(null), onError: () => setPendingStatus(null) }
        );
    };

    const config = pendingStatus ? ACTION_CONFIG[pendingStatus] : null;

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-9 rounded-md" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-7 w-36" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                </div>
                {/* Cards skeleton */}
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-5 w-44" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <React.Fragment key={j}>
                                        <div className="space-y-1">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-5 w-3/4" />
                                        </div>
                                        {j < 5 && <Separator />}
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="space-y-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="size-4" />
                </Button>
                <EmptyState
                    icon={UserIcon}
                    title="Rider Not Found"
                    description="This rider does not exist or you don't have permission to view it."
                    actions={[
                        { label: "Go Back", href: "#", variant: "outline" },
                        { label: "All Riders", href: "/admin-dashboard/riders", variant: "default" },
                    ]}
                />
            </div>
        );
    }

    const status = application.accountStatus;
    const name = application.user.name;

    // Build contextual action items based on current status
    type ActionItem = { label: string; newStatus: RiderAccountStatus; icon: React.ReactNode; isDestructive?: boolean };
    const actionItems: ActionItem[] = [];
    if (status === "PENDING") {
        actionItems.push(
            { label: "Approve", newStatus: "ACTIVE", icon: <CheckCircle className="size-4" /> },
            { label: "Reject", newStatus: "REJECTED", icon: <XCircle className="size-4" />, isDestructive: true },
        );
    } else if (status === "ACTIVE") {
        actionItems.push(
            { label: "Suspend", newStatus: "SUSPENDED", icon: <PauseCircle className="size-4" />, isDestructive: true },
            { label: "Reject", newStatus: "REJECTED", icon: <XCircle className="size-4" />, isDestructive: true },
        );
    } else if (status === "SUSPENDED") {
        actionItems.push(
            { label: "Reactivate", newStatus: "ACTIVE", icon: <RotateCcw className="size-4" /> },
            { label: "Reject", newStatus: "REJECTED", icon: <XCircle className="size-4" />, isDestructive: true },
        );
    } else if (status === "REJECTED") {
        actionItems.push(
            { label: "Approve", newStatus: "ACTIVE", icon: <CheckCircle className="size-4" /> },
            { label: "Suspend", newStatus: "SUSPENDED", icon: <PauseCircle className="size-4" />, isDestructive: true },
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="size-4" />
                        </Button>
                        <div>
                            <h1 className="section-heading-text text-2xl font-bold tracking-tight">
                                Rider Details
                            </h1>
                            <p className="text-muted-foreground">
                                Viewing profile for {name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={ACCOUNT_STATUS_VARIANT[status]} variant="default">
                            {status}
                        </StatusBadge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5"
                                    disabled={updateStatusMutation.isPending}
                                >
                                    {updateStatusMutation.isPending ? "Processing..." : "Actions"}
                                    <ChevronDown className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                {actionItems.map((item, idx) => (
                                    <React.Fragment key={item.newStatus}>
                                        {idx > 0 && item.isDestructive && !actionItems[idx - 1]?.isDestructive && (
                                            <DropdownMenuSeparator />
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => setPendingStatus(item.newStatus)}
                                            className={item.isDestructive
                                                ? "text-destructive gap-2 focus:text-destructive focus:bg-destructive/10"
                                                : "gap-2"}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </DropdownMenuItem>
                                    </React.Fragment>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Applicant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="size-5" />
                                Applicant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">{name}</p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Mail className="size-4 text-muted-foreground" />
                                    {application.user.email}
                                </p>
                            </div>
                            {application.user.phone && (
                                <>
                                    <Separator />
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Phone className="size-4 text-muted-foreground" />
                                            {application.user.phone}
                                        </p>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email Verified</p>
                                <StatusBadge
                                    status={application.user.emailVerified ? "success" : "warning"}
                                    variant="outline"
                                >
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="size-3" />
                                        {application.user.emailVerified ? "Verified" : "Not Verified"}
                                    </span>
                                </StatusBadge>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">User Since</p>
                                <p className="text-sm flex items-center gap-2">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    {format(new Date(application.user.createdAt), "dd MMM yyyy")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rider Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="size-5" />
                                Rider Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">District</p>
                                <p className="font-medium flex items-center gap-2">
                                    <MapPin className="size-4 text-muted-foreground" />
                                    {application.district}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Account Status</p>
                                <StatusBadge status={ACCOUNT_STATUS_VARIANT[status]} variant="default">
                                    {status}
                                </StatusBadge>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Rating</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Star className="size-4 text-yellow-500" />
                                    {application.rating.toFixed(1)} ({application.totalRatings} reviews)
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Deliveries</p>
                                <p className="font-medium flex items-center gap-2">
                                    <Package className="size-4 text-muted-foreground" />
                                    {application.totalDeliveries}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Applied On</p>
                                <p className="text-sm flex items-center gap-2">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    {format(new Date(application.createdAt), "dd MMM yyyy, hh:mm a")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Confirmation AlertDialog */}
            <AlertDialog open={!!pendingStatus} onOpenChange={(open) => !open && setPendingStatus(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {config?.description(name)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updateStatusMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={updateStatusMutation.isPending}
                            className={config?.isDestructive
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : ""}
                        >
                            {updateStatusMutation.isPending ? "Processing..." : config?.actionLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


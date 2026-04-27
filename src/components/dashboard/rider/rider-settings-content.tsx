"use client";

import { useRiderProfile } from "@/hooks/use-rider-profile";
import { RiderStatusUpdate } from "@/components/dashboard/rider/rider-status-update";
import { RiderSettingsSkeleton } from "@/components/dashboard/rider/rider-settings-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, User, RefreshCw } from "lucide-react";

export function RiderSettingsContent() {
    const { data, isLoading } = useRiderProfile();

    if (isLoading || !data) {
        return <RiderSettingsSkeleton />;
    }

    const profile = data?.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Separator />

            {/* Availability Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="size-5" />
                        Availability Status
                    </CardTitle>
                    <CardDescription>
                        Set your current availability status to control when you receive parcel assignments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Current Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Change your availability to receive or stop receiving parcel assignments.
                            </p>
                        </div>
                        <RiderStatusUpdate currentStatus={profile?.currentStatus} />
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings (Placeholder for future) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="size-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Manage how you receive notifications about parcels and updates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="notifications" className="text-base font-medium">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications on your device
                            </p>
                        </div>
                        <Switch id="notifications" disabled />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch id="email-notifications" disabled />
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings (Placeholder for future) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="size-5" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Manage your account security settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="two-factor" className="text-base font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <Switch id="two-factor" disabled />
                    </div>
                </CardContent>
            </Card>

            {/* Account Settings (Placeholder for future) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="size-5" />
                        Account
                    </CardTitle>
                    <CardDescription>
                        Manage your account information and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="profile-visibility" className="text-base font-medium">Profile Visibility</Label>
                            <p className="text-sm text-muted-foreground">
                                Control who can see your profile information
                            </p>
                        </div>
                        <Switch id="profile-visibility" disabled />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChangePasswordModal from "@/components/dashboard/account/change-password-modal";
import { useState } from "react";
import { RiderStatusUpdate } from "@/components/dashboard/rider/rider-status-update";

export type UserRole = "CUSTOMER" | "ADMIN" | "RIDER" | "SUPER_ADMIN";

interface SettingsContentProps {
  userRole: UserRole;
  currentStatus?: "AVAILABLE" | "BUSY" | "OFFLINE";
}

export function SettingsContent({ userRole, currentStatus }: SettingsContentProps) {
  const isRider = userRole === "RIDER";
  const [isChangeOpen, setIsChangeOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading-text text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Separator />

      {/* Availability Settings - Rider Only */}
      {isRider && (
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
              {currentStatus && <RiderStatusUpdate currentStatus={currentStatus} />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings (Placeholder for future) - Common for all */}
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

      {/* Security Settings (Placeholder for future) - Common for all */}
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

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium">Change Password</p>
                <p className="text-sm text-orange-400">Update your account password. This is a sensitive action - use a strong, unique password.</p>
              </div>
              <div>
                <Button size="sm" variant="outline" onClick={() => setIsChangeOpen(true)}>
                  Change password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordModal open={isChangeOpen} onOpenChange={setIsChangeOpen} />

      {/* Account Settings (Placeholder for future) - Common for all */}
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

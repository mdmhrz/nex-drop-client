"use client";

import { useAdminUser, useUpdateUserRole, useUpdateUserStatus } from "@/hooks/use-admin-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User as UserIcon, Mail, Calendar, Shield, AlertTriangle, ArrowLeft, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole, UserStatus } from "@/services/admin.server";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function AdminUserDetailsContent({ userId }: { userId: string }) {
  const router = useRouter();
  const { data, isLoading } = useAdminUser(userId);
  const [selectedUserForRole, setSelectedUserForRole] = useState(false);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>("CUSTOMER");
  const [newStatus, setNewStatus] = useState<UserStatus>("ACTIVE");

  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();

  const handleUpdateRole = () => {
    if (data?.data) {
      updateRoleMutation.mutate(
        { id: userId, params: { role: newRole } },
        {
          onSuccess: () => {
            setSelectedUserForRole(false);
          },
        }
      );
    }
  };

  const handleUpdateStatus = () => {
    if (data?.data) {
      updateStatusMutation.mutate(
        { id: userId, params: { status: newStatus } },
        {
          onSuccess: () => {
            setSelectedUserForStatus(false);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const user = data?.data;

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <EmptyState
          icon={UserX}
          title="User Not Found"
          description="The user you're looking for doesn't exist or you don't have permission to view it."
          actions={[
            { label: "Go Back", href: "javascript:history.back()", variant: "outline" },
            { label: "View All Users", href: "/admin-dashboard/users", variant: "default" },
          ]}
        />
      </div>
    );
  }

  const statusConfig: Record<string, "success" | "warning" | "destructive" | "info"> = {
    ACTIVE: "success",
    BLOCKED: "destructive",
    DELETED: "destructive",
  };

  const roleColors: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    CUSTOMER: "default",
    ADMIN: "secondary",
    RIDER: "outline",
    SUPER_ADMIN: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="section-heading-text text-2xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">View and manage user information.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="size-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {user.email}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant={roleColors[user.role]}>{user.role}</Badge>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Status</p>
              <StatusBadge status={statusConfig[user.status] || "info"} variant="default">
                {user.status}
              </StatusBadge>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email Verified</p>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-BD", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {new Date(user.updatedAt).toLocaleDateString("en-BD", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator />
            <div className="space-y-4 pt-4">
              <Button
                onClick={() => {
                  setNewRole(user.role);
                  setSelectedUserForRole(true);
                }}
                className="w-full"
                variant="outline"
              >
                <Shield className="mr-2 h-4 w-4" />
                Update Role
              </Button>
              <Button
                onClick={() => {
                  setNewStatus(user.status);
                  setSelectedUserForStatus(true);
                }}
                className="w-full"
                variant="outline"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Role Dialog */}
      <Dialog open={selectedUserForRole} onOpenChange={setSelectedUserForRole}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the role for {user.name} ({user.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="RIDER">Rider</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedUserForRole(false)}
              disabled={updateRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={updateRoleMutation.isPending || newRole === user.role}
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={selectedUserForStatus} onOpenChange={setSelectedUserForStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>
              Change the status for {user.name} ({user.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(value: UserStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedUserForStatus(false)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending || newStatus === user.status}
              variant={newStatus === "DELETED" ? "destructive" : "default"}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

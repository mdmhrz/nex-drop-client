"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus, type AdminUser } from "@/hooks/use-admin-users";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { Eye, Shield, AlertTriangle, Search, X } from "lucide-react";
import type { UserRole, UserStatus } from "@/services/admin.server";
import { Input } from "@/components/ui/input";


// ─── Column definitions ───────────────────────────────────────────────────────

const getRiderColumns = (
  onView: (user: AdminUser) => void,
  onUpdateRole: (user: AdminUser) => void,
  onUpdateStatus: (user: AdminUser) => void
): ColumnDef<AdminUser>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue<UserRole>();
        const roleColors: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
          CUSTOMER: "default",
          ADMIN: "secondary",
          RIDER: "outline",
          SUPER_ADMIN: "destructive",
        };
        return (
          <Badge variant={roleColors[role]}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<UserStatus>();
        const statusMap: Record<UserStatus, "success" | "warning" | "destructive" | "default"> = {
          ACTIVE: "success",
          BLOCKED: "destructive",
          DELETED: "destructive",
        };
        return (
          <StatusBadge status={statusMap[status] ?? "default"} variant="default">
            {status}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Verified",
      cell: ({ getValue }) => {
        const verified = getValue<boolean>();
        return (
          <StatusBadge status={verified ? "success" : "warning"} variant="outline">
            {verified ? "Yes" : "No"}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {new Date(getValue<string>()).toLocaleDateString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        const actions = [
          {
            label: "View Details",
            icon: <Eye className="size-4" />,
            onClick: () => onView(user),
          },
          {
            label: "Update Role",
            icon: <Shield className="size-4" />,
            onClick: () => onUpdateRole(user),
          },
          {
            label: "Update Status",
            icon: <AlertTriangle className="size-4" />,
            onClick: () => onUpdateStatus(user),
          },
        ];

        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminRidersTable() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [selectedUserForRole, setSelectedUserForRole] = useState<AdminUser | null>(null);
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("CUSTOMER");
  const [newStatus, setNewStatus] = useState<UserStatus>("ACTIVE");

  const { data, isLoading } = useAdminUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
  });

  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();

  const handleView = (user: AdminUser) => {
    router.push(`/admin-dashboard/users/${user.id}`);
  };

  const handleUpdateRole = (user: AdminUser) => {
    setSelectedUserForRole(user);
    setNewRole(user.role);
  };

  const handleUpdateStatus = (user: AdminUser) => {
    setSelectedUserForStatus(user);
    setNewStatus(user.status);
  };

  const handleConfirmRole = () => {
    if (selectedUserForRole) {
      updateRoleMutation.mutate(
        { id: selectedUserForRole.id, params: { role: newRole } },
        {
          onSuccess: () => {
            setSelectedUserForRole(null);
          },
        }
      );
    }
  };

  const handleConfirmStatus = () => {
    if (selectedUserForStatus) {
      updateStatusMutation.mutate(
        { id: selectedUserForStatus.id, params: { status: newStatus } },
        {
          onSuccess: () => {
            setSelectedUserForStatus(null);
          },
        }
      );
    }
  };

  const columns = getRiderColumns(handleView, handleUpdateRole, handleUpdateStatus);

  const resetSearch = () => {
    setSearch("");
  };

  // Filter for riders only
  const riders = data?.data?.filter(user => user.role === "RIDER") ?? [];

  return (
    <>
      <div className="space-y-6">
        {/* Search Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={resetSearch}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={riders}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No riders found."
          pagination={{
            state: pagination,
            onChange: setPagination,
            pageCount: Math.ceil((riders.length || 0) / pagination.pageSize),
            totalItems: riders.length,
          }}
        />
      </div>

      {/* Update Role Dialog */}
      <Dialog open={!!selectedUserForRole} onOpenChange={(open) => !open && setSelectedUserForRole(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Rider Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUserForRole?.name} ({selectedUserForRole?.email})
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
              onClick={() => setSelectedUserForRole(null)}
              disabled={updateRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRole}
              disabled={updateRoleMutation.isPending || newRole === selectedUserForRole?.role}
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedUserForStatus} onOpenChange={(open) => !open && setSelectedUserForStatus(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Rider Status</DialogTitle>
            <DialogDescription>
              Change the status for {selectedUserForStatus?.name} ({selectedUserForStatus?.email})
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
              onClick={() => setSelectedUserForStatus(null)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatus}
              disabled={updateStatusMutation.isPending || newStatus === selectedUserForStatus?.status}
              variant={newStatus === "DELETED" ? "destructive" : "default"}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

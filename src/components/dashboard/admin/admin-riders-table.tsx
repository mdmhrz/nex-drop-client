"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import {
  useAdminRiderApplications,
  useUpdateRiderAccountStatus,
  type RiderApplication,
} from "@/hooks/use-admin-rider-applications";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableActionDropdown } from "@/components/shared/table-action-dropdown";
import { Eye, CheckCircle, XCircle, PauseCircle, Search, X, Star, RotateCcw, FileText, Bike } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { RiderAccountStatus } from "@/services/admin.server";
import { format } from "date-fns";
import { UserAvatar } from "@/components/shared/user-avatar";

// ─── Types ─────────────────────────────────────────────────────────────────────

type PendingAction = { rider: RiderApplication; newStatus: RiderAccountStatus } | null;

// ─── Status & action config ────────────────────────────────────────────────────

const STATUS_VARIANT: Record<RiderAccountStatus, "success" | "warning" | "destructive" | "default"> = {
  ACTIVE: "success",
  PENDING: "warning",
  SUSPENDED: "warning",
  REJECTED: "destructive",
};

const ACTION_CONFIG: Record<RiderAccountStatus, {
  title: string;
  description: (name: string) => string;
  actionLabel: string;
  isDestructive: boolean;
}> = {
  ACTIVE: {
    title: "Approve Rider",
    description: (name) =>
      `Approve ${name}? They will be marked as an active rider and their role will be updated to Rider.`,
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

// ─── Active Riders columns ─────────────────────────────────────────────────────

const getActiveRidersColumns = (
  onView: (r: RiderApplication) => void,
  onAction: (r: RiderApplication, s: RiderAccountStatus) => void,
): ColumnDef<RiderApplication>[] => [
    {
      accessorKey: "user.name",
      header: "Rider",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.user.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    },
    {
      accessorKey: "accountStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<RiderAccountStatus>();
        return <StatusBadge status={STATUS_VARIANT[s]} variant="default">{s}</StatusBadge>;
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <Star className="size-3 text-yellow-500" />
          {row.original.rating.toFixed(1)}
          <span className="text-muted-foreground">({row.original.totalRatings})</span>
        </span>
      ),
    },
    {
      accessorKey: "totalDeliveries",
      header: "Deliveries",
      cell: ({ getValue }) => <span className="text-sm">{getValue<number>()}</span>,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        const isActive = r.accountStatus === "ACTIVE";
        const actions = [
          { label: "View Details", icon: <Eye className="size-4" />, onClick: () => onView(r) },
          isActive
            ? { label: "Suspend", icon: <PauseCircle className="size-4" />, onClick: () => onAction(r, "SUSPENDED") }
            : { label: "Reactivate", icon: <RotateCcw className="size-4" />, onClick: () => onAction(r, "ACTIVE") },
          { label: "Reject", icon: <XCircle className="size-4" />, onClick: () => onAction(r, "REJECTED") },
        ];
        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

// ─── Applications columns ──────────────────────────────────────────────────────

const getApplicationsColumns = (
  onView: (r: RiderApplication) => void,
  onAction: (r: RiderApplication, s: RiderAccountStatus) => void,
): ColumnDef<RiderApplication>[] => [
    {
      accessorKey: "user.name",
      header: "Applicant",
      cell: ({ row }) => (
        <div>
          <UserAvatar
            showDetails={true}
            name={row.original.user.name}
            email={row.original.user.email} />
        </div>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    },
    {
      accessorKey: "accountStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const s = getValue<RiderAccountStatus>();
        return <StatusBadge status={STATUS_VARIANT[s]} variant="default">{s}</StatusBadge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(getValue<string>()), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        const actions = [
          { label: "View Details", icon: <Eye className="size-4" />, onClick: () => onView(r) },
          { label: "Approve", icon: <CheckCircle className="size-4" />, onClick: () => onAction(r, "ACTIVE") },
          { label: "Reject", icon: <XCircle className="size-4" />, onClick: () => onAction(r, "REJECTED") },
        ];
        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

// ─── Per-tab inner component ───────────────────────────────────────────────────

function RidersTab({
  tab,
  defaultStatusFilter,
  statusOptions,
  onView,
  onAction,
}: {
  tab: "active" | "applications";
  defaultStatusFilter: RiderAccountStatus | "ALL";
  statusOptions: { value: RiderAccountStatus | "ALL"; label: string }[];
  onView: (r: RiderApplication) => void;
  onAction: (r: RiderApplication, s: RiderAccountStatus) => void;
}) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RiderAccountStatus | "ALL">(defaultStatusFilter);

  const { data, isLoading } = useAdminRiderApplications({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: search || undefined,
    accountStatus: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const columns = tab === "active"
    ? getActiveRidersColumns(onView, onAction)
    : getApplicationsColumns(onView, onAction);

  const riders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50 max-w-sm">
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
              onClick={() => setSearch("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as RiderAccountStatus | "ALL");
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="!h-9 w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        data={riders}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={tab === "active" ? "No active riders found." : "No applications found."}
        pagination={{
          state: pagination,
          onChange: setPagination,
          pageCount: totalPages,
          totalItems,
        }}
      />
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function AdminRidersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [currentTab, setCurrentTab] = useState<"active" | "applications">(
    (searchParams.get("tab") as "active" | "applications") || "active"
  );
  const updateStatusMutation = useUpdateRiderAccountStatus();

  const handleView = (r: RiderApplication) => {
    router.push(`/admin-dashboard/riders/${r.id}`);
  };

  const handleAction = (r: RiderApplication, newStatus: RiderAccountStatus) => {
    setPendingAction({ rider: r, newStatus });
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    updateStatusMutation.mutate(
      { riderId: pendingAction.rider.id, params: { accountStatus: pendingAction.newStatus } },
      { onSuccess: () => setPendingAction(null), onError: () => setPendingAction(null) }
    );
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as "active" | "applications");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", tab);
    router.push(`?${newParams.toString()}`);
  };

  const config = pendingAction ? ACTION_CONFIG[pendingAction.newStatus] : null;

  return (
    <>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        {/* Tab header — button-style active tab + full-width border below */}
        <div >
          <TabsList className="bg-transparent border-none border-transparent pl-0">
            <TabsTrigger
              value="active"
              className="
                px-4 py-2.5 gap-2 rounded-none !border-0
                bg-transparent shadow-none
                text-muted-foreground font-medium text-sm
                hover:text-foreground/70
                data-[state=active]:!border-b-2
                data-[state=active]:!border-b-primary
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:font-bold
                data-[state=active]:text-primary
                data-[state=active]:hover:text-primary
                [&>svg]:data-[state=active]:text-primary
                dark:data-[state=active]:text-primary
                dark:data-[state=active]:hover:text-primary
                dark:[&>svg]:data-[state=active]:text-primary
                dark:!bg-transparent
              "
            >
              <Bike className="w-4 h-4" />
              Active Riders
            </TabsTrigger>

            <TabsTrigger
              value="applications"
              className="
                px-4 py-2.5 gap-2 rounded-none !border-0
                bg-transparent shadow-none
                text-muted-foreground font-medium text-sm
                hover:text-foreground/70
                data-[state=active]:!border-b-2
                data-[state=active]:!border-b-primary
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:font-bold
                data-[state=active]:text-primary
                data-[state=active]:hover:text-primary
                [&>svg]:data-[state=active]:text-primary
                dark:data-[state=active]:text-primary
                dark:data-[state=active]:hover:text-primary
                dark:[&>svg]:data-[state=active]:text-primary
                dark:!bg-transparent
              "
            >
              <FileText className="w-4 h-4" />
              Applications
            </TabsTrigger>
          </TabsList>
          <hr className="-mt-1" />
        </div>
        <TabsContent value="active" className="mt-4">
          <RidersTab
            tab="active"
            defaultStatusFilter="ACTIVE"
            statusOptions={[
              { value: "ACTIVE", label: "Active" },
              { value: "SUSPENDED", label: "Suspended" },
              { value: "ALL", label: "All" },
            ]}
            onView={handleView}
            onAction={handleAction}
          />
        </TabsContent>
        <TabsContent value="applications" className="mt-4">
          <RidersTab
            tab="applications"
            defaultStatusFilter="PENDING"
            statusOptions={[
              { value: "PENDING", label: "Pending" },
              { value: "REJECTED", label: "Rejected" },
              { value: "ALL", label: "All" },
            ]}
            onView={handleView}
            onAction={handleAction}
          />
        </TabsContent>
      </Tabs>

      {/* Shared confirmation AlertDialog */}
      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description(pendingAction?.rider.user.name ?? "")}
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

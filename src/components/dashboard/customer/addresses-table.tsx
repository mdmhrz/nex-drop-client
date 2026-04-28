"use client";

import { useState } from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import { useAddresses, useAddressMutations, type Address } from "@/hooks/use-addresses";
import { TableActionDropdown, type TableAction } from "@/components/shared/table-action-dropdown";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddressFormModal } from "./address-form-modal";
import { DeleteAddressDialog } from "./delete-address-dialog";

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressesTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedAddressForEdit, setSelectedAddressForEdit] = useState<Address | null>(null);
  const [selectedAddressForDelete, setSelectedAddressForDelete] = useState<Address | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useAddresses({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const { deleteAddress, setDefaultAddress, isDeleting, isSettingDefault } = useAddressMutations();

  const handleEdit = (address: Address) => {
    setSelectedAddressForEdit(address);
  };

  const handleDelete = (address: Address) => {
    setSelectedAddressForDelete(address);
  };

  const handleConfirmDelete = (address: Address) => {
    deleteAddress(address.id);
    setSelectedAddressForDelete(null);
  };

  const handleSetDefault = (address: Address) => {
    setDefaultAddress(address.id);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const columns: ColumnDef<Address>[] = [
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.label}</span>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-start gap-2">
          <span className="text-sm">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.district}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.phone || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "isDefault",
      header: "Default",
      cell: ({ row }) => {
        const isDefault = row.original.isDefault;
        return isDefault ? (
          <StatusBadge status="active">Default</StatusBadge>
        ) : (
          <StatusBadge status="inactive">No</StatusBadge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
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
        const address = row.original;
        const actions: TableAction[] = [
          {
            label: "Edit",
            icon: <Pencil className="size-4" />,
            onClick: () => handleEdit(address),
          },
        ];

        if (!address.isDefault) {
          actions.push({
            label: "Set Default",
            icon: <Check className="size-4" />,
            onClick: () => handleSetDefault(address),
            disabled: isSettingDefault,
          });
        }

        actions.push({
          label: "Delete",
          icon: <Trash2 className="size-4" />,
          onClick: () => handleDelete(address),
        });

        return <TableActionDropdown actions={actions} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No addresses found."
        showCheckbox={false}
        pagination={{
          state: pagination,
          onChange: setPagination,
          pageCount: data?.meta?.totalPages,
          totalItems: data?.meta?.total,
        }}
        onCreate={handleCreate}
        createButtonLabel="Add Address"
      />

      {/* Create Address Modal */}
      <AddressFormModal
        address={null}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Edit Address Modal */}
      {selectedAddressForEdit && (
        <AddressFormModal
          address={selectedAddressForEdit}
          open={!!selectedAddressForEdit}
          onOpenChange={(open) => !open && setSelectedAddressForEdit(null)}
        />
      )}

      {/* Delete Address Dialog */}
      {selectedAddressForDelete && (
        <DeleteAddressDialog
          address={selectedAddressForDelete}
          open={!!selectedAddressForDelete}
          onOpenChange={(open) => !open && setSelectedAddressForDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

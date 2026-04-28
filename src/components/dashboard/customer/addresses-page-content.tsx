"use client";

import { AddressesTable } from "./addresses-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddressFormModal } from "./address-form-modal";
import { Plus } from "lucide-react";

export function AddressesPageContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading-text text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="text-muted-foreground">Manage your saved addresses</p>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4 mr-2" />
            Add Address
          </Button>
        </div>
      </div>

      <AddressesTable />

      <AddressFormModal address={null} open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

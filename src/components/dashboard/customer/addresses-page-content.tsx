"use client";

import { AddressesTable } from "./addresses-table";

export function AddressesPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Addresses</h1>
        <p className="text-muted-foreground">Manage your saved addresses</p>
      </div>

      <AddressesTable />
    </div>
  );
}

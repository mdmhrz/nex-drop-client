"use client";

import { ParcelsTable } from "./parcels-table";

export function ParcelsPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading-text text-2xl font-bold tracking-tight">My Parcels</h1>
        <p className="text-muted-foreground">Track and manage your parcels</p>
      </div>

      <ParcelsTable />
    </div>
  );
}

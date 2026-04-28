"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/layouts/dashboard/sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard/header";
import { UserRole } from "@/lib/rbac";


interface DashboardShellProps {
    children: React.ReactNode;
    user: {
        name?: string;
        email: string;
        role: UserRole;
    };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <DashboardSidebar
                role={user.role}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className="flex flex-1 flex-col min-w-0">
                <DashboardHeader
                    user={user}
                    onMobileMenuOpen={() => setMobileOpen(true)}
                />
                <main className="flex-1 p-4 md:p-6 overflow-auto custom-scrollbar">{children}</main>
            </div>
        </div>
    );
}

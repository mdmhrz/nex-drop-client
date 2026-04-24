"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  User,
  Settings,
  Truck,
  DollarSign,
  Users
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  // Determine which dashboard section we're in
  const isCustomerDashboard = pathname.startsWith("/dashboard");
  const isRiderDashboard = pathname.startsWith("/rider-dashboard");

  const navigationItems = isCustomerDashboard ? [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: Package },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ] : isRiderDashboard ? [
    { name: "Dashboard", href: "/rider-dashboard", icon: LayoutDashboard },
    { name: "Deliveries", href: "/rider-dashboard/deliveries", icon: Truck },
    { name: "Earnings", href: "/rider-dashboard/earnings", icon: DollarSign },
    { name: "Profile", href: "/rider-dashboard/profile", icon: User },
  ] : [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin-dashboard/users", icon: Users },
    { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-bold text-xl">NexDrop</span>
      </div>
      <nav className="space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

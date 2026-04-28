"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/layouts/dashboard/user-dropdown";
import { NotificationBell } from "@/components/shared/notification-bell";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UserRole } from "@/lib/rbac";

interface DashboardHeaderProps {
  user: {
    name?: string;
    email: string;
    role: UserRole;
  };
  onMobileMenuOpen?: () => void;
}

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  const labelMap: Record<string, string> = {
    "dashboard": "Dashboard",
    "rider-dashboard": "Dashboard",
    "admin-dashboard": "Dashboard",
    "parcels": "Parcels",
    "create-parcel": "Create Parcel",
    "addresses": "Addresses",
    "payments": "Payments",
    "profile": "Profile",
    "settings": "Settings",
    "available": "Available Parcels",
    "deliveries": "My Deliveries",
    "earnings": "Earnings",
    "ratings": "Ratings",
    "riders": "Riders",
    "users": "Users",
    "analytics": "Analytics",
  };

  return segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = labelMap[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });
}

export function DashboardHeader({ user, onMobileMenuOpen }: DashboardHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
      {/* Left: Hamburger (mobile) + Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <Home className="h-3.5 w-3.5" />
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbs.map((crumb) => (
              <span key={crumb.href} className="flex items-center">
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href} className="text-muted-foreground hover:text-foreground">
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Theme + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <NotificationBell />

        {/* User Dropdown */}
        <UserDropdown user={user} />
      </div>
    </header>
  );
}

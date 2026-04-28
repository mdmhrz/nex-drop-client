"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavigationForRole, getSettingsRouteForRole } from "@/lib/navigationConfig";
import { UserRole } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";

interface DashboardSidebarProps {
  role: UserRole;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavItems({
  role,
  collapsed,
  onNavigate,
}: {
  role: UserRole;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const navigationSections = getNavigationForRole(UserRole[role] as UserRole);

  return (
    <TooltipProvider delayDuration={0}>
      <nav className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {section.title && !collapsed && (
              <h3 className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            {section.title && collapsed && (
              <div className="mx-auto my-2 h-px w-6 bg-border" />
            )}
            <div className="space-y-2 mb-8">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isDashboardRoot =
                  item.href === "/dashboard" ||
                  item.href === "/rider-dashboard" ||
                  item.href === "/admin-dashboard";

                const isActive = isDashboardRoot
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                const linkEl = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  );
                }
                return linkEl;
              })}
            </div>
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}

export function DashboardSidebar({ role, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const settingsRoute = getSettingsRouteForRole(UserRole[role] as UserRole);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-muted dark:bg-card transition-all duration-300 ease-in-out relative shrink-0 h-screen",
          collapsed ? "w-14" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn("flex h-16 items-center border-b px-4 shrink-0", collapsed && "justify-center px-2")}>

          <Logo showName={!collapsed} />
        </div>

        {/* Nav */}
        <NavItems role={role} collapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="shrink-0 border-t p-2 flex justify-between">
          {!collapsed ? (
            <Link
              href={settingsRoute}
              className={cn(
                "flex items-center gap-3 rounded-lg ml-1 w-full px-3 py-2 text-sm font-medium transition-colors",
                pathname === settingsRoute
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </Link>
          ) : (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={settingsRoute}
                    className={cn(
                      "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors",
                      pathname === settingsRoute
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <span className="font-bold text-xl tracking-tight font-nevera">NexDrop</span>
          </div>
          <NavItems role={role} collapsed={false} onNavigate={onMobileClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}

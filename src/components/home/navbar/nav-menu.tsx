"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NAV_ITEMS, type UserRole } from "@/components/home/navbar/nav-items";

interface NavMenuProps extends ComponentProps<typeof NavigationMenu> {
  isLoggedIn?: boolean;
  role?: UserRole;
}

export const NavMenu = ({ isLoggedIn = false, role, ...props }: NavMenuProps) => {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.requiresAuth && !isLoggedIn) return false;
    if (item.prohibitedRoles && role && item.prohibitedRoles.includes(role)) return false;
    return true;
  });

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full transition-colors duration-200",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};


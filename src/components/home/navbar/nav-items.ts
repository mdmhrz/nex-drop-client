export type NavItem = {
    label: string;
    href: string;
    requiresAuth?: boolean;
    prohibitedRoles?: UserRole[];
};

export const NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Coverage", href: "/coverage" },
    { label: "Contact", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "Be a Rider", href: "/be-a-rider", prohibitedRoles: ["RIDER"] },
];

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "CUSTOMER";

export function getDashboardHref(role: UserRole): string {
    if (role === "SUPER_ADMIN" || role === "ADMIN") return "/admin-dashboard";
    if (role === "RIDER") return "/rider-dashboard";
    return "/dashboard";
}

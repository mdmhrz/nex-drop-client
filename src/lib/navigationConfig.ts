import {
    LayoutDashboard,
    Package,
    User,
    Settings,
    Truck,
    DollarSign,
    Users,
    Zap,
    MapPin,
    Star,
    CreditCard,
    BarChart3,
} from "lucide-react";
import { UserRole } from "./rbac";

export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: UserRole[];
    description?: string;
}

export interface NavigationSection {
    title?: string;
    items: NavigationItem[];
}

// Role-based navigation configuration
export const navigationConfig: Record<UserRole, NavigationSection[]> = {
    CUSTOMER: [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                    roles: ["CUSTOMER"],
                    description: "View your dashboard",
                },
                {
                    name: "My Parcels",
                    href: "/dashboard/parcels",
                    icon: Package,
                    roles: ["CUSTOMER"],
                    description: "Track your parcels",
                },
            ],
        },
        {
            title: "Operations",
            items: [
                {
                    name: "Create Parcel",
                    href: "/dashboard/create-parcel",
                    icon: Zap,
                    roles: ["CUSTOMER"],
                    description: "Send a new parcel",
                },
                {
                    name: "Addresses",
                    href: "/dashboard/addresses",
                    icon: MapPin,
                    roles: ["CUSTOMER"],
                    description: "Manage addresses",
                },
                {
                    name: "Payments",
                    href: "/dashboard/payments",
                    icon: CreditCard,
                    roles: ["CUSTOMER"],
                    description: "View payments",
                },
            ],
        },
        {
            title: "Account",
            items: [
                {
                    name: "Profile",
                    href: "/dashboard/profile",
                    icon: User,
                    roles: ["CUSTOMER"],
                    description: "Edit profile",
                },
                {
                    name: "Settings",
                    href: "/dashboard/settings",
                    icon: Settings,
                    roles: ["CUSTOMER"],
                    description: "Account settings",
                },
            ],
        },
    ],

    RIDER: [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard",
                    href: "/rider-dashboard",
                    icon: LayoutDashboard,
                    roles: ["RIDER"],
                    description: "View your dashboard",
                },
                {
                    name: "Available Parcels",
                    href: "/rider-dashboard/available",
                    icon: Package,
                    roles: ["RIDER"],
                    description: "Find parcels to deliver",
                },
                {
                    name: "My Deliveries",
                    href: "/rider-dashboard/deliveries",
                    icon: Truck,
                    roles: ["RIDER"],
                    description: "Active deliveries",
                },
            ],
        },
        {
            title: "Earnings",
            items: [
                {
                    name: "Earnings",
                    href: "/rider-dashboard/earnings",
                    icon: DollarSign,
                    roles: ["RIDER"],
                    description: "View earnings",
                },
                {
                    name: "Cashouts",
                    href: "/rider-dashboard/cashouts",
                    icon: CreditCard,
                    roles: ["RIDER"],
                    description: "Manage cashouts",
                },
                {
                    name: "Ratings",
                    href: "/rider-dashboard/ratings",
                    icon: Star,
                    roles: ["RIDER"],
                    description: "Your ratings",
                },
            ],
        },
        {
            title: "Account",
            items: [
                {
                    name: "Profile",
                    href: "/rider-dashboard/profile",
                    icon: User,
                    roles: ["RIDER"],
                    description: "Edit profile",
                },
                {
                    name: "Settings",
                    href: "/rider-dashboard/settings",
                    icon: Settings,
                    roles: ["RIDER"],
                    description: "Account settings",
                },
            ],
        },
    ],

    ADMIN: [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard",
                    href: "/admin-dashboard",
                    icon: LayoutDashboard,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "View dashboard",
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    name: "Parcels",
                    href: "/admin-dashboard/parcels",
                    icon: Package,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "Manage all parcels",
                },
                {
                    name: "Riders",
                    href: "/admin-dashboard/riders",
                    icon: Truck,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "Manage riders",
                },
                {
                    name: "Users",
                    href: "/admin-dashboard/users",
                    icon: Users,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "Manage users",
                },
                {
                    name: "Payments",
                    href: "/admin-dashboard/payments",
                    icon: CreditCard,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "Payment tracking",
                },
            ],
        },
        {
            title: "Analytics",
            items: [
                {
                    name: "Analytics",
                    href: "/admin-dashboard/analytics",
                    icon: BarChart3,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "View analytics",
                },
            ],
        },
        {
            title: "System",
            items: [
                {
                    name: "Settings",
                    href: "/admin-dashboard/settings",
                    icon: Settings,
                    roles: ["ADMIN", "SUPER_ADMIN"],
                    description: "System settings",
                },
            ],
        },
    ],

    SUPER_ADMIN: [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard",
                    href: "/admin-dashboard",
                    icon: LayoutDashboard,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "View dashboard",
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    name: "Parcels",
                    href: "/admin-dashboard/parcels",
                    icon: Package,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "Manage all parcels",
                },
                {
                    name: "Riders",
                    href: "/admin-dashboard/riders",
                    icon: Truck,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "Manage riders",
                },
                {
                    name: "Users",
                    href: "/admin-dashboard/users",
                    icon: Users,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "Manage users",
                },
                {
                    name: "Payments",
                    href: "/admin-dashboard/payments",
                    icon: CreditCard,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "Payment tracking",
                },
            ],
        },
        {
            title: "Analytics",
            items: [
                {
                    name: "Analytics",
                    href: "/admin-dashboard/analytics",
                    icon: BarChart3,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "View analytics",
                },
            ],
        },
        {
            title: "System",
            items: [
                {
                    name: "Settings",
                    href: "/admin-dashboard/settings",
                    icon: Settings,
                    roles: ["SUPER_ADMIN", "ADMIN"],
                    description: "System settings",
                },
            ],
        },
    ],
};

export const getNavigationForRole = (role: UserRole | null): NavigationSection[] => {
    if (!role) return [];
    return navigationConfig[role] || [];
};

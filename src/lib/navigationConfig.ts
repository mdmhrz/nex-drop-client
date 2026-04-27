import {
    LayoutDashboard,
    Package,
    Zap,
    MapPin,
    CreditCard,
    User,
    Settings,
    Truck,
    BarChart3,
    Users,
    DollarSign,
    Star,
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

export interface RoleNavigationConfig {
    sections: NavigationSection[];
    settingsRoute: string;
}

// Admin navigation sections (shared between ADMIN and SUPER_ADMIN)
const adminNavigationSections: NavigationSection[] = [
    {
        title: "Main",
        items: [
            {
                name: "Dashboard",
                href: "/admin-dashboard",
                icon: LayoutDashboard,
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
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
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
                description: "Manage all parcels",
            },
            {
                name: "Riders",
                href: "/admin-dashboard/riders",
                icon: Truck,
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
                description: "Manage riders",
            },
            {
                name: "Users",
                href: "/admin-dashboard/users",
                icon: Users,
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
                description: "Manage users",
            },
            {
                name: "Payments",
                href: "/admin-dashboard/payments",
                icon: CreditCard,
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
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
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
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
                roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
                description: "System settings",
            },
        ],
    },
];

// Role-based navigation configuration
export const navigationConfig: Record<UserRole, RoleNavigationConfig> = {
    CUSTOMER: {
        sections: [
            {
                title: "Main",
                items: [
                    {
                        name: "Dashboard",
                        href: "/dashboard",
                        icon: LayoutDashboard,
                        roles: [UserRole.CUSTOMER],
                        description: "View your dashboard",
                    },
                    {
                        name: "My Parcels",
                        href: "/dashboard/parcels",
                        icon: Package,
                        roles: [UserRole.CUSTOMER],
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
                        roles: [UserRole.CUSTOMER],
                        description: "Send a new parcel",
                    },
                    {
                        name: "Addresses",
                        href: "/dashboard/addresses",
                        icon: MapPin,
                        roles: [UserRole.CUSTOMER],
                        description: "Manage addresses",
                    },
                    {
                        name: "Payments",
                        href: "/dashboard/payments",
                        icon: CreditCard,
                        roles: [UserRole.CUSTOMER],
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
                        roles: [UserRole.CUSTOMER],
                        description: "Edit profile",
                    },
                    {
                        name: "Settings",
                        href: "/dashboard/settings",
                        icon: Settings,
                        roles: [UserRole.CUSTOMER],
                        description: "Account settings",
                    },
                ],
            },
        ],
        settingsRoute: "/dashboard/settings",
    },

    RIDER: {
        sections: [
            {
                title: "Main",
                items: [
                    {
                        name: "Dashboard",
                        href: "/rider-dashboard",
                        icon: LayoutDashboard,
                        roles: [UserRole.RIDER],
                        description: "View your dashboard",
                    },
                    {
                        name: "Available Parcels",
                        href: "/rider-dashboard/available",
                        icon: Package,
                        roles: [UserRole.RIDER],
                        description: "Find parcels to deliver",
                    },
                    {
                        name: "My Deliveries",
                        href: "/rider-dashboard/deliveries",
                        icon: Truck,
                        roles: [UserRole.RIDER],
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
                        roles: [UserRole.RIDER],
                        description: "View earnings",
                    },
                    {
                        name: "Cashouts",
                        href: "/rider-dashboard/cashouts",
                        icon: CreditCard,
                        roles: [UserRole.RIDER],
                        description: "Manage cashouts",
                    },
                    {
                        name: "Ratings",
                        href: "/rider-dashboard/ratings",
                        icon: Star,
                        roles: [UserRole.RIDER],
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
                        roles: [UserRole.RIDER],
                        description: "Edit profile",
                    },
                ],
            },
        ],
        settingsRoute: "/rider-dashboard/settings",
    },

    ADMIN: {
        sections: adminNavigationSections,
        settingsRoute: "/admin-dashboard/settings",
    },

    SUPER_ADMIN: {
        sections: adminNavigationSections,
        settingsRoute: "/admin-dashboard/settings",
    },
};

export const getNavigationForRole = (role: UserRole | null): NavigationSection[] => {
    if (!role) return [];
    return navigationConfig[role]?.sections || [];
};

export const getSettingsRouteForRole = (role: UserRole | null): string => {
    if (!role) return "";
    return navigationConfig[role]?.settingsRoute || "";
};

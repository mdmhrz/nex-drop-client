export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "CUSTOMER";

/**
 * Authentication routes that don't require login
 */
export const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];

/**
 * Public routes accessible to everyone
 */
export const publicRoutes = ["/", "/about", "/contact", "/coverage", "/be-a-rider", "/help", "/track-order"];

/**
 * Check if a route is an authentication route
 */
export const isAuthRoute = (path: string): boolean => {
    return authRoutes.some((route) => path === route || path.startsWith(route));
};

/**
 * Check if a route is public
 */
export const isPublicRoute = (path: string): boolean => {
    return publicRoutes.some(
        (route) => path === route || (route !== "/" && path.startsWith(route + "/"))
    );
};

/**
 * Route configuration for role-based access
 */
export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

/**
 * Common routes accessible to all authenticated users
 */
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password", "/settings"],
    pattern: [],
};

/**
 * Admin and Super Admin protected routes (shared)
 * Both ADMIN and SUPER_ADMIN use the same routes
 */
export const adminProtectedRoutes: RouteConfig = {
    exact: ["/admin-dashboard"],
    pattern: [
        /^\/admin-dashboard\//,
        /^\/admin\//,
    ],
};

/**
 * Rider protected routes
 */
export const riderProtectedRoutes: RouteConfig = {
    exact: ["/rider-dashboard"],
    pattern: [
        /^\/rider-dashboard\//,
        /^\/rider\//,
    ],
};

/**
 * Customer/CUSTOMER protected routes
 */
export const customerProtectedRoutes: RouteConfig = {
    exact: ["/dashboard"],
    pattern: [
        /^\/dashboard\//,
    ],
};

/**
 * Check if a path matches any route in the config
 */
export const isRouteMatched = (path: string, routeConfig: RouteConfig): boolean => {
    if (routeConfig.exact.includes(path)) {
        return true;
    }
    return routeConfig.pattern.some((pattern) => pattern.test(path));
};

/**
 * Get the owner/required role for a specific route
 * Returns: Role required, "COMMON" for common routes, or null for public routes
 */
export const getRouteOwner = (path: string): UserRole | "COMMON" | null => {
    // Check public routes first
    if (isPublicRoute(path) || isAuthRoute(path)) {
        return null;
    }

    // Check common protected routes
    if (isRouteMatched(path, commonProtectedRoutes)) {
        return "COMMON";
    }

    // Check role-specific routes
    if (isRouteMatched(path, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if (isRouteMatched(path, riderProtectedRoutes)) {
        return "RIDER";
    }

    if (isRouteMatched(path, customerProtectedRoutes)) {
        return "CUSTOMER";
    }

    return null; // Unmatched routes are considered public
};

/**
 * Get the default dashboard route for a user role
 * ADMIN and SUPER_ADMIN share the same routes
 */
export const getDefaultDashboardRoute = (role: UserRole | null): string => {
    if (!role) return "/";

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return "/admin-dashboard";
        case "RIDER":
            return "/rider-dashboard";
        case "CUSTOMER":
            return "/dashboard";
        default:
            return "/";
    }
};

/**
 * Get the main dashboard redirect path (without /dashboard suffix)
 */
export const getDashboardPath = (role: UserRole | null): string => {
    if (!role) return "/";

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return "/admin-dashboard";
        case "RIDER":
            return "/rider-dashboard";
        case "CUSTOMER":
            return "/dashboard";
        default:
            return "/";
    }
};

/**
 * Check if a user can access a specific route based on their role
 */
export const canUserAccessRoute = (
    userRole: UserRole | null,
    path: string
): boolean => {
    // Unauthenticated users access
    if (!userRole) {
        // Can access public and auth routes
        return isPublicRoute(path) || isAuthRoute(path);
    }

    // Authenticated users can always access public routes
    if (isPublicRoute(path)) {
        return true;
    }

    // Cannot access auth routes if already authenticated
    if (isAuthRoute(path)) {
        return false;
    }

    const routeOwner = getRouteOwner(path);

    // Common routes - all authenticated users can access
    if (routeOwner === "COMMON") {
        return true;
    }

    // Public route after auth check
    if (routeOwner === null) {
        return true;
    }

    // Role-specific routes - check if user role matches
    if (routeOwner === "ADMIN") {
        return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    }

    if (routeOwner === userRole) {
        return true;
    }

    return false;
};

/**
 * Validate if a redirect path is valid for a given role
 */
export const isValidRedirectForRole = (
    redirectPath: string,
    role: UserRole | null
): boolean => {
    if (!role) return isPublicRoute(redirectPath) || isAuthRoute(redirectPath);

    // Normalize SUPER_ADMIN to ADMIN
    const normalizedRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    const routeOwner = getRouteOwner(redirectPath);

    // Common or public routes are valid for all roles
    if (routeOwner === "COMMON" || routeOwner === null) {
        return true;
    }

    // Check if route owner matches user role
    if (routeOwner === "ADMIN") {
        return normalizedRole === "ADMIN";
    }

    return routeOwner === normalizedRole;
};

/**
 * Get login page path with optional redirect parameter
 */
export const getLoginPagePath = (currentPath: string): string => {
    const loginUrl = new URL("/login", "http://localhost");
    loginUrl.searchParams.set("redirect", currentPath);
    return loginUrl.pathname + loginUrl.search;
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "CUSTOMER";

export const roleHierarchy: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  RIDER: 2,
  CUSTOMER: 1,
};

export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessRoute(userRole: UserRole | undefined, route: string): boolean {
  if (!userRole) return false;

  // Public routes - no auth required
  if (route.startsWith("/(public)") || route === "/") {
    return true;
  }

  // Auth routes - should not be accessible if already authenticated
  if (route.startsWith("/(auth)")) {
    return false;
  }

  // Dashboard routes - role-based access
  if (route.startsWith("/dashboard")) {
    return userRole === "CUSTOMER";
  }

  if (route.startsWith("/rider-dashboard")) {
    return userRole === "RIDER";
  }

  if (route.startsWith("/admin-dashboard")) {
    return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  }

  return false;
}

export function getDashboardRedirect(userRole: UserRole): string {
  switch (userRole) {
    case "CUSTOMER":
      return "/dashboard";
    case "RIDER":
      return "/rider-dashboard";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin-dashboard";
    default:
      return "/";
  }
}

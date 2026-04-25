/**
 * RBAC (Role-Based Access Control) Module
 * Handles role hierarchy, permissions, and access control
 */

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "CUSTOMER";

/**
 * Role hierarchy - higher number = higher privilege
 */
export const roleHierarchy: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  RIDER: 2,
  CUSTOMER: 1,
};

/**
 * Role permissions mapping
 */
export const rolePermissions: Record<UserRole, string[]> = {
  SUPER_ADMIN: [
    "manage_users",
    "manage_roles",
    "manage_system_settings",
    "view_analytics",
    "manage_riders",
    "manage_customers",
    "manage_admins",
    "view_reports",
    "manage_disputes",
    "manage_payments",
  ],
  ADMIN: [
    "manage_users",
    "view_analytics",
    "manage_riders",
    "manage_customers",
    "view_reports",
    "manage_disputes",
    "manage_payments",
  ],
  RIDER: [
    "view_rides",
    "accept_rides",
    "complete_rides",
    "view_earnings",
    "update_profile",
    "manage_documents",
    "manage_vehicle",
    "view_history",
  ],
  CUSTOMER: [
    "book_rides",
    "view_rides",
    "pay_rides",
    "rate_rides",
    "manage_wallet",
    "update_profile",
    "view_history",
  ],
};

/**
 * Get parent role in hierarchy (for delegated permissions)
 */
export const getParentRole = (role: UserRole): UserRole | null => {
  switch (role) {
    case "CUSTOMER":
      return null; // No parent
    case "RIDER":
      return null; // No parent
    case "ADMIN":
      return "SUPER_ADMIN";
    case "SUPER_ADMIN":
      return null; // No parent
    default:
      return null;
  }
};

/**
 * Check if user has a specific role
 * @param userRole - User's role
 * @param requiredRole - Required role
 * @returns Boolean indicating if user has the required role
 */
export function hasRole(userRole: UserRole | undefined | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return userRole === requiredRole;
}

/**
 * Check if user has role or higher in hierarchy
 * @param userRole - User's role
 * @param minimumRole - Minimum required role
 * @returns Boolean indicating if user meets hierarchy requirement
 */
export function hasRoleOrHigher(
  userRole: UserRole | undefined | null,
  minimumRole: UserRole
): boolean {
  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}

/**
 * Check if user has permission
 * @param userRole - User's role
 * @param permission - Permission to check
 * @returns Boolean indicating if user has permission
 */
export function hasPermission(userRole: UserRole | undefined | null, permission: string): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

/**
 * Check if user has any of the given permissions
 * @param userRole - User's role
 * @param permissions - Array of permissions
 * @returns Boolean indicating if user has at least one permission
 */
export function hasAnyPermission(
  userRole: UserRole | undefined | null,
  permissions: string[]
): boolean {
  if (!userRole) return false;
  return permissions.some((permission) =>
    rolePermissions[userRole]?.includes(permission)
  );
}

/**
 * Check if user has all given permissions
 * @param userRole - User's role
 * @param permissions - Array of permissions
 * @returns Boolean indicating if user has all permissions
 */
export function hasAllPermissions(
  userRole: UserRole | undefined | null,
  permissions: string[]
): boolean {
  if (!userRole) return false;
  return permissions.every((permission) =>
    rolePermissions[userRole]?.includes(permission)
  );
}

/**
 * Get all permissions for a role
 * @param userRole - User's role
 * @returns Array of permissions for the role
 */
export function getPermissions(userRole: UserRole | undefined | null): string[] {
  if (!userRole) return [];
  return rolePermissions[userRole] ?? [];
}

/**
 * Compare two roles
 * @param role1 - First role
 * @param role2 - Second role
 * @returns -1 if role1 < role2, 0 if equal, 1 if role1 > role2
 */
export function compareRoles(role1: UserRole, role2: UserRole): number {
  const hierarchy1 = roleHierarchy[role1];
  const hierarchy2 = roleHierarchy[role2];

  if (hierarchy1 < hierarchy2) return -1;
  if (hierarchy1 > hierarchy2) return 1;
  return 0;
}

/**
 * Get role description/title
 * @param role - User role
 * @returns Human-readable role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Administrator",
    ADMIN: "Administrator",
    RIDER: "Rider",
    CUSTOMER: "Customer",
  };
  return descriptions[role] || role;
}

/**
 * Get role badge color (for UI)
 * @param role - User role
 * @returns Color code or class name
 */
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    SUPER_ADMIN: "red",
    ADMIN: "orange",
    RIDER: "blue",
    CUSTOMER: "green",
  };
  return colors[role] || "gray";
}

/**
 * Check if role can manage another role
 * @param managerRole - Role of the manager/admin
 * @param targetRole - Role being managed
 * @returns Boolean indicating if manager can manage target role
 */
export function canManageRole(managerRole: UserRole | null, targetRole: UserRole): boolean {
  if (!managerRole) return false;

  // Only SUPER_ADMIN can manage all roles
  if (managerRole === "SUPER_ADMIN") {
    return true;
  }

  // ADMIN can manage RIDER and CUSTOMER
  if (managerRole === "ADMIN") {
    return targetRole === "RIDER" || targetRole === "CUSTOMER";
  }

  // Other roles cannot manage anyone
  return false;
}

/**
 * Get list of roles that can be managed by the given role
 * @param role - Manager role
 * @returns Array of manageable roles
 */
export function getManageableRoles(role: UserRole | null): UserRole[] {
  if (!role) return [];

  switch (role) {
    case "SUPER_ADMIN":
      return ["SUPER_ADMIN", "ADMIN", "RIDER", "CUSTOMER"];
    case "ADMIN":
      return ["RIDER", "CUSTOMER"];
    case "RIDER":
    case "CUSTOMER":
      return []; // Cannot manage any roles
    default:
      return [];
  }
}

/**
 * Is the role an admin role?
 * @param role - User role
 * @returns Boolean indicating if role is admin level
 */
export function isAdminRole(role: UserRole | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * Is the role a customer role?
 * @param role - User role
 * @returns Boolean indicating if role is customer
 */
export function isCustomerRole(role: UserRole | null): boolean {
  return role === "CUSTOMER";
}

/**
 * Is the role a rider role?
 * @param role - User role
 * @returns Boolean indicating if role is rider
 */
export function isRiderRole(role: UserRole | null): boolean {
  return role === "RIDER";
}

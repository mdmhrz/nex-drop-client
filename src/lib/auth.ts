import { cookies } from "next/headers";
import { jwtUtils } from "./jwtUtils";
import { UserRole } from "./rbac";

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  emailVerified?: boolean;
  needPasswordChange?: boolean;
}

/**
 * Get the current authenticated user from JWT token in cookies
 * @returns User object if valid token exists, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Decode token (verification happens on backend)
    const decoded = jwtUtils.decodedToken(accessToken);

    if (!decoded) {
      return null;
    }

    // Map decoded token to User interface
    const user: User = {
      id: decoded.id || decoded.sub || "",
      email: decoded.email || "",
      role: (decoded.role as UserRole) || "CUSTOMER",
      name: decoded.name,
      emailVerified: decoded.emailVerified ?? false,
      needPasswordChange: decoded.needPasswordChange ?? false,
      ...decoded, // Include all other fields
    };

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get access token from cookies
 * @returns Access token string or null
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value || null;
  } catch {
    return null;
  }
}

/**
 * Get refresh token from cookies
 * @returns Refresh token string or null
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value || null;
  } catch {
    return null;
  }
}

/**
 * Require authentication - throw error if user is not authenticated
 * @returns User object if authenticated
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized - No valid authentication token");
  }
  return user;
}

/**
 * Require specific role(s) - throw error if user doesn't have required role
 * @param requiredRole - Single role or array of roles
 * @returns User object if authorized
 * @throws Error if not authorized
 */
export async function requireRole(
  requiredRole: UserRole | UserRole[]
): Promise<User> {
  const user = await requireAuth();
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(user.role)) {
    throw new Error(
      `Forbidden - Required role(s): ${roles.join(", ")}, but user has: ${user.role}`
    );
  }

  return user;
}

/**
 * Check if user has specific role(s)
 * @param requiredRole - Single role or array of roles
 * @returns Boolean indicating if user has required role
 */
export async function hasRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Check if user email is verified
 * @returns Boolean indicating if email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.emailVerified ?? false;
}

/**
 * Check if user needs to change password
 * @returns Boolean indicating if password change is required
 */
export async function doesUserNeedPasswordChange(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.needPasswordChange ?? false;
}

/**
 * Check if access token is expiring soon
 * @param thresholdSeconds - Time threshold in seconds
 * @returns Boolean indicating if token is expiring soon
 */
export async function isAccessTokenExpiringSoon(thresholdSeconds: number = 300): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) return false;

    const remaining = jwtUtils.getRemainingTokenTime(token);
    if (remaining === null) return false;

    return remaining <= thresholdSeconds;
  } catch {
    return false;
  }
}

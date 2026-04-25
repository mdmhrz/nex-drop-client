# Authentication & Authorization System Documentation

## Overview

This document provides a complete guide to the authentication and authorization system implemented for the Nex Drop Client project. The system handles:

- JWT token verification and management
- Role-Based Access Control (RBAC)
- Route protection and middleware
- Token expiry and refresh
- Password reset enforcement
- Email verification requirements

## Architecture

### Core Components

1. **middleware.ts** - Next.js middleware for request interception
2. **lib/authUtils.ts** - Route configuration and access control logic
3. **lib/jwtUtils.ts** - JWT token verification and decoding
4. **lib/tokenUtils.ts** - Token expiry and time utilities
5. **lib/auth.ts** - Server-side authentication utilities
6. **lib/rbac.ts** - Role-Based Access Control utilities

## User Roles

```
SUPER_ADMIN (Level 4)
    ↓
ADMIN (Level 3)
    ├→ RIDER (Level 2)
    └→ CUSTOMER (Level 1)
```

### Role Permissions

#### SUPER_ADMIN
- manage_users, manage_roles, manage_system_settings
- view_analytics, view_reports
- manage_riders, manage_customers, manage_admins
- manage_disputes, manage_payments

#### ADMIN
- manage_users, view_analytics
- manage_riders, manage_customers
- view_reports, manage_disputes, manage_payments

#### RIDER
- view_rides, accept_rides, complete_rides
- view_earnings, update_profile
- manage_documents, manage_vehicle, view_history

#### CUSTOMER
- book_rides, view_rides, pay_rides
- rate_rides, manage_wallet, update_profile, view_history

## Route Protection

### Public Routes
```
/ - Home page
/(public)/* - Public pages
```

### Authentication Routes
```
/login - User login
/register - User registration
/forgot-password - Forgot password
/reset-password - Reset password (requires auth)
/verify-email - Email verification (requires auth)
```

### Protected Routes by Role

#### Admin Routes
```
/admin-dashboard/* - Admin dashboard
/admin/* - Admin management pages
/manage-* - Management pages
/users - User management
```

#### Rider Routes
```
/rider-dashboard/* - Rider dashboard
/rides/* - Ride management
/earnings/* - Earnings tracking
/documents/* - Document management
/vehicle/* - Vehicle management
```

#### Customer Routes
```
/dashboard/* - Customer dashboard
/bookings/* - Booking management
/wallet/* - Wallet management
/ride-history/* - Ride history
/payment/* - Payment pages (success/failed)
```

#### Common Routes (All Authenticated Users)
```
/my-profile - User profile
/change-password - Change password
/settings - Settings
```

## Middleware Flow

### Request Processing Order

1. **Force Password Reset** (Highest Priority)
   - If `needPasswordChange` flag is true, redirect all requests to `/reset-password`

2. **Reset Password Page**
   - If accessing `/reset-password`, verify authentication
   - If password change complete, redirect to dashboard

3. **Email Verification Page**
   - If accessing `/verify-email`, allow for initial verification
   - After verification, redirect to dashboard

4. **Public Routes**
   - Allow access to everyone
   - Redirect authenticated users to dashboard

5. **Authentication Routes**
   - Prevent authenticated users from accessing login/register
   - Allow unauthenticated users

6. **Unprotected Routes**
   - Redirect unauthenticated users to login

7. **Role-Based Access Control**
   - Check if user's role matches route requirements
   - Redirect to default dashboard if unauthorized

8. **Token Expiry Check**
   - Set header if token expiring soon
   - Frontend can trigger refresh

## Usage Examples

### Server-Side (Next.js Pages/API Routes)

#### Get Current User
```typescript
import { getCurrentUser } from '@/lib/auth';

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Handle unauthenticated user
    redirect('/login');
  }
  
  return <div>Hello, {user.name}</div>;
}
```

#### Require Authentication
```typescript
import { requireAuth } from '@/lib/auth';

export default async function ProtectedPage() {
  const user = await requireAuth(); // Throws if not authenticated
  
  return <div>User: {user.email}</div>;
}
```

#### Require Specific Role
```typescript
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  const user = await requireRole('ADMIN'); // Only ADMIN and SUPER_ADMIN
  
  return <div>Admin: {user.email}</div>;
}
```

#### Check Role
```typescript
import { hasRole } from '@/lib/auth';

export default async function Dashboard() {
  const isAdmin = await hasRole('ADMIN');
  const isCustomer = await hasRole('CUSTOMER');
  
  return (
    <div>
      {isAdmin && <AdminSection />}
      {isCustomer && <CustomerSection />}
    </div>
  );
}
```

### RBAC Functions

#### Check Permission Hierarchy
```typescript
import { hasRoleOrHigher, getPermissions } from '@/lib/rbac';

// Check if user has role or higher in hierarchy
const hasAdminAccess = hasRoleOrHigher(userRole, 'ADMIN');

// Get all permissions for a role
const permissions = getPermissions(userRole);
console.log(permissions); // ['manage_users', 'view_analytics', ...]
```

#### Check Permissions
```typescript
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions 
} from '@/lib/rbac';

// Single permission
if (hasPermission(userRole, 'manage_users')) {
  // Show user management section
}

// Any permission
if (hasAnyPermission(userRole, ['manage_users', 'manage_riders'])) {
  // Show management section
}

// All permissions
if (hasAllPermissions(userRole, ['view_analytics', 'view_reports'])) {
  // Show analytics dashboard
}
```

#### Role Management
```typescript
import { 
  canManageRole, 
  getManageableRoles,
  getRoleDescription 
} from '@/lib/rbac';

// Check if manager can manage target role
if (canManageRole(managerRole, 'RIDER')) {
  // Manager can manage riders
}

// Get all roles that manager can manage
const manageable = getManageableRoles(userRole);

// Get role description for display
const display = getRoleDescription('ADMIN'); // "Administrator"
```

#### Type Checking
```typescript
import { 
  isAdminRole, 
  isCustomerRole, 
  isRiderRole 
} from '@/lib/rbac';

if (isAdminRole(userRole)) {
  // Show admin features
}

if (isCustomerRole(userRole)) {
  // Show customer features
}

if (isRiderRole(userRole)) {
  // Show rider features
}
```

### Token Management Functions

#### Check Token Expiry
```typescript
import { isTokenExpiringSoon, getTimeUntilTokenExpiry } from '@/lib/tokenUtils';
import { jwtUtils } from '@/lib/jwtUtils';

// Check if token expiring soon (within 5 minutes by default)
if (isTokenExpiringSoon(accessToken)) {
  // Trigger token refresh
}

// Get remaining time
const remaining = getTimeUntilTokenExpiry(accessToken); // milliseconds

// Check remaining time from JWT utility
const remainingSeconds = jwtUtils.getRemainingTokenTime(accessToken);
```

#### Format Token Time
```typescript
import { formatTokenTimeRemaining } from '@/lib/tokenUtils';

const timeStr = formatTokenTimeRemaining(accessToken);
console.log(timeStr); // "5 minutes", "30 seconds", etc.
```

### Client-Side Usage (React Components)

#### Protected Component
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Client can't directly check auth, use layout/middleware
    // But can respond to headers or stored data
    setIsLoading(false);
  }, []);
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>Admin Panel Content</div>;
}
```

## Edge Cases Handled

### 1. Force Password Reset
- Highest priority in middleware
- Blocks ALL page access except `/reset-password`
- Persists redirect until password changed
- Prevents accidental bypass

### 2. Email Verification
- Can access before email verified
- Auto-redirects after verification
- Can re-verify if needed

### 3. Authenticated User Accessing Auth Routes
- Prevents login/register/forgot-password access
- Auto-redirects to dashboard

### 4. Token Expiry
- Checks expiry on every request
- Sets header when expiring soon
- Frontend can trigger refresh

### 5. Role Mismatch
- User accessing wrong role's routes
- Auto-redirects to correct dashboard
- Prevents unauthorized access

### 6. Missing/Invalid Tokens
- Redirects to login with callback
- Preserves requested route in query param
- Enables post-login redirect

### 7. Static File Bypass
- Middleware ignores static files
- Excludes: `_next/`, `.svg`, `.png`, `.jpg`, etc.
- Optimized for performance

### 8. SUPER_ADMIN Normalization
- SUPER_ADMIN treated as ADMIN
- Maintains hierarchy consistency
- Simplifies route checks

### 9. Redirect Loop Prevention
- Validates redirect paths
- Prevents infinite redirects
- Checks role before redirecting

### 10. Cookie Not Found
- Gracefully handles missing cookies
- Returns null instead of error
- Treats as unauthenticated

## Environment Variables

```env
# Required for JWT verification
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Optional token refresh endpoint
NEXT_PUBLIC_TOKEN_REFRESH_URL=/api/auth/refresh

# Optional for token expiry check (in seconds)
NEXT_PUBLIC_TOKEN_EXPIRY_THRESHOLD=300
```

## Integration Checklist

- [ ] Install dependencies (if needed)
- [ ] Add environment variables
- [ ] Update middleware location to `src/middleware.ts`
- [ ] Configure `next.config.ts` for middleware
- [ ] Test all role routes
- [ ] Test password reset flow
- [ ] Test email verification flow
- [ ] Test token expiry handling
- [ ] Test logout/session clearing
- [ ] Test redirect with query params

## Error Handling

### Common Scenarios

1. **No Valid Token**
   - User redirected to login
   - Original route saved in query params

2. **Token Expired**
   - User redirected to login
   - Should implement token refresh first

3. **Insufficient Permissions**
   - User redirected to default dashboard
   - Error message can be shown

4. **Password Change Required**
   - User forced to reset password
   - Other routes blocked

5. **Email not Verified**
   - User can access certain routes
   - Redirected to verify after registration

## Security Considerations

1. **Token Storage**
   - Access token stored in HTTP-only cookie
   - Never store in localStorage

2. **CSRF Protection**
   - Implement CSRF tokens for mutations
   - Validate origin on API routes

3. **Role Validation**
   - Always verify role on backend
   - Never trust client-side role checks

4. **Token Expiry**
   - Implement refresh token flow
   - Set reasonable expiry times

5. **Route Matching**
   - Use regex patterns for flexibility
   - Test all route variations

## Migration Guide

### From Old System

If migrating from commented-out code in `check-proxy.ts`:

1. Replace `getUserRole()` with `getCurrentUser()` 
2. Replace `getDashboardRedirect()` with `getDefaultDashboardRoute()`
3. Replace `canAccessRoute()` with `canUserAccessRoute()`
4. Update route patterns in `authUtils.ts`
5. Add new middleware.ts to root src folder

## Troubleshooting

### Middleware Not Triggering
- Check `middleware.ts` location (should be in `src/` at root)
- Verify matcher config includes desired routes
- Check `next.config.ts` has `middleware` export

### Getting Stuck on Login
- Check token verification failure
- Verify JWT_SECRET is correct
- Check cookie names match (accessToken)

### False Auth Redirects
- Check route patterns in `authUtils.ts`
- Verify role in token matches UserRole type
- Check for typos in route paths

### Token Always Expiring
- Check JWT secret consistency
- Verify token generation includes exp
- Check system clock sync

## Testing

```typescript
// Example test file
import { getRouteOwner, canUserAccessRoute } from '@/lib/authUtils';

describe('Auth Utils', () => {
  test('should identify admin routes', () => {
    expect(getRouteOwner('/admin-dashboard')).toBe('ADMIN');
  });
  
  test('should allow admin access to admin routes', () => {
    expect(canUserAccessRoute('ADMIN', '/admin-dashboard')).toBe(true);
  });
  
  test('should block customer from admin routes', () => {
    expect(canUserAccessRoute('CUSTOMER', '/admin-dashboard')).toBe(false);
  });
});
```

## Support & Customization

To customize:

1. **Add new roles**: Update `UserRole` type and add role config
2. **Add new routes**: Update route configs in `authUtils.ts`
3. **Change permissions**: Modify `rolePermissions` in `rbac.ts`
4. **Custom redirect logic**: Modify `getDefaultDashboardRoute()`
5. **Token strategy**: Update token verification in middleware

---

**Last Updated**: 2024
**Version**: 1.0.0

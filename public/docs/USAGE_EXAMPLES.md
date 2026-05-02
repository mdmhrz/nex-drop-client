/**
 * Practical Code Examples & Usage Patterns
 * Location: USAGE_EXAMPLES.md
 */

# Practical Usage Examples

## Server Components (Pages)

### Basic Protected Page

```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  // This will throw if not authenticated (caught by error boundary)
  const user = await requireAuth();
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Role-Protected Page

```typescript
// app/admin-dashboard/page.tsx
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  // This will throw if not admin
  const admin = await requireRole('ADMIN');
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Logged in as: {admin.email}</p>
    </div>
  );
}
```

### Conditional Content Based on Role

```typescript
// app/my-profile/page.tsx
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { isAdminRole } from '@/lib/rbac';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Please log in to view your profile</div>;
  }
  
  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      
      {isAdminRole(user.role) && (
        <div>
          <h2>Admin Options</h2>
          <p>You have admin access</p>
        </div>
      )}
    </div>
  );
}
```

### Check Multiple Roles

```typescript
// app/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { isAdminRole, isRiderRole, isCustomerRole } from '@/lib/rbac';

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Unauthorized</div>;
  }
  
  if (isAdminRole(user.role)) {
    return <AdminDashboard user={user} />;
  }
  
  if (isRiderRole(user.role)) {
    return <RiderDashboard user={user} />;
  }
  
  if (isCustomerRole(user.role)) {
    return <CustomerDashboard user={user} />;
  }
  
  return <div>Unknown role</div>;
}
```

## API Routes

### Protected GET Endpoint

```typescript
// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Admin-Only POST Endpoint

```typescript
// app/api/admin/users/ban/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireRole('ADMIN');
    const { userId } = await request.json();
    
    // Ban user logic
    // ...
    
    return NextResponse.json({
      success: true,
      message: `User ${userId} has been banned`,
    });
  } catch (error: any) {
    // Could be auth error (thrown by requireRole)
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if (error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Permission-Based Access

```typescript
// app/api/reports/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!hasPermission(user.role, 'view_reports')) {
    return NextResponse.json(
      { error: 'You cannot generate reports' },
      { status: 403 }
    );
  }
  
  // Generate report
  return NextResponse.json({ success: true, reportId: 123 });
}
```

### Token Verification in API

```typescript
// app/api/verify-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtUtils } from '@/lib/jwtUtils';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  
  const result = jwtUtils.verifyToken(
    token,
    process.env.NEXT_PUBLIC_JWT_SECRET || ''
  );
  
  if (!result.success) {
    return NextResponse.json(
      {
        valid: false,
        error: result.message,
      },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    valid: true,
    data: result.data,
  });
}
```

## Client Components (React)

### Login Form

```typescript
// components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      // Middleware will handle redirect
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Protected Component

```typescript
// components/admin-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSection() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Client can't directly check auth
    // This is handled by middleware and headers
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check');
        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          // Optionally redirect
          // router.push('/dashboard');
        }
      } catch (error) {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [router]);
  
  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied</div>;
  
  return <div>Admin content</div>;
}
```

### Token Refresh Handler

```typescript
// lib/tokenRefresh.ts
import { isTokenExpiringSoon } from './tokenUtils';

export async function refreshTokenIfNeeded(accessToken: string) {
  if (!isTokenExpiringSoon(accessToken, 600)) {
    return; // Token is still valid for >10 minutes
  }
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Cookie will be automatically updated
      // Optionally reload or trigger refresh
      window.location.reload();
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Redirect to login
    window.location.href = '/login';
  }
}

// Use in useEffect or API interceptor
export function useTokenRefresh() {
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getCookie('accessToken');
      if (token) {
        refreshTokenIfNeeded(token);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
}
```

## Layout Components

### Protected Layout

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/layouts/dashboard/sidebar';
import Header from '@/components/layouts/dashboard/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect entire layout
  const user = await requireAuth();
  
  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <Header user={user} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Admin Layout with Permission Check

```typescript
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import adminLayout from '@/components/layouts/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireRole('ADMIN');
  
  return (
    <div className="admin-layout">
      <adminLayout admin={admin}>
        {children}
      </adminLayout>
    </div>
  );
}
```

## Error Handling

### Error Boundary

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### 403 Forbidden Page

```typescript
// app/forbidden/page.tsx
export default function ForbiddenPage() {
  return (
    <div>
      <h1>403 - Forbidden</h1>
      <p>You don't have permission to access this page.</p>
      <a href="/dashboard">Return to Dashboard</a>
    </div>
  );
}
```

## Middleware Helper Functions

### Role-Based Route Handler

```typescript
// lib/routeHelpers.ts
import { getCurrentUser } from './auth';
import { isAdminRole, isRiderRole, isCustomerRole } from './rbac';

export async function handleRoleBasedRoute(handler: {
  admin?: (user: any) => any;
  rider?: (user: any) => any;
  customer?: (user: any) => any;
  default?: (user: any) => any;
}) {
  const user = await getCurrentUser();
  
  if (!user) return handler.default?.(null);
  
  if (isAdminRole(user.role) && handler.admin) {
    return handler.admin(user);
  }
  
  if (isRiderRole(user.role) && handler.rider) {
    return handler.rider(user);
  }
  
  if (isCustomerRole(user.role) && handler.customer) {
    return handler.customer(user);
  }
  
  return handler.default?.(user);
}

// Usage:
export default async function MyPage() {
  return handleRoleBasedRoute({
    admin: (user) => <AdminDashboard user={user} />,
    rider: (user) => <RiderDashboard user={user} />,
    customer: (user) => <CustomerDashboard user={user} />,
    default: () => <UnauthorizedPage />,
  });
}
```

## Testing Examples

### Unit Test

```typescript
// __tests__/auth.test.ts
import { hasRole, canUserAccessRoute, getDefaultDashboardRoute } from '@/lib/rbac';

describe('RBAC', () => {
  test('hasRole checks exact role', () => {
    expect(hasRole('ADMIN', 'ADMIN')).toBe(true);
    expect(hasRole('ADMIN', 'CUSTOMER')).toBe(false);
    expect(hasRole(null, 'ADMIN')).toBe(false);
    expect(hasRole(undefined, 'ADMIN')).toBe(false);
  });
  
  test('getDefaultDashboardRoute returns correct URL', () => {
    expect(getDefaultDashboardRoute('ADMIN')).toBe('/admin-dashboard');
    expect(getDefaultDashboardRoute('RIDER')).toBe('/rider-dashboard');
    expect(getDefaultDashboardRoute('CUSTOMER')).toBe('/dashboard');
    expect(getDefaultDashboardRoute(null)).toBe('/');
  });
});
```

### Integration Test

```typescript
// __tests__/auth.integration.test.ts
describe('Auth Flow Integration', () => {
  test('user login redirects to dashboard', async () => {
    // Login
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
      }),
    });
    
    // Check cookie set
    expect(response.headers.get('set-cookie')).toContain('accessToken');
    
    // Check can access dashboard
    const dashResponse = await fetch('/dashboard', {
      headers: { Cookie: 'accessToken=...' },
    });
    expect(dashResponse.status).toBe(200);
  });
});
```

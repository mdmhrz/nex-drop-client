# Admin Dashboard Implementation TODO

## Project Structure Analysis

### Architecture Pattern
- **Server Components**: Use `.server.ts` services with `serverFetch` for SSR (cache: "no-store")
- **Client Components**: Use `.service.ts` services with `apiClient` (axios) for interactive operations
- **State Management**: TanStack Query for client-side data fetching and mutations
- **Design System**: shadcn/ui components everywhere
- **Hydration Pattern**: For profile/settings pages - server prefetches data with QueryClient, renders client component with HydrationBoundary

### Existing Services
- `user.server.ts` - getUserDashboard, getParcels, cancelParcel, initiatePayment, updateProfile
- `rider.server.ts` - getRiderProfile, getRiderDashboard, getCashouts, requestCashout, getEarnings
- `parcel.server.ts` - getParcelById
- `auth.service.ts` - auth operations
- `address.service.ts`, `address.server.ts` - address operations
- `parcel.service.ts` - parcel operations
- `rating.service.ts`, `rating.server.ts` - rating operations
- `rider.service.ts` - rider operations
- `rider.client.ts` - rider client operations

### Existing Hooks
- `use-addresses.ts` - address management
- `use-assigned-parcels.ts` - assigned parcels for riders
- `use-available-parcels.ts` - available parcels for riders
- `use-cashouts.ts` - cashout management
- `use-create-parcel.ts` - create parcel
- `use-customer-profile.ts` - customer profile
- `use-earnings.ts` - earnings management
- `use-mobile.ts` - mobile detection
- `use-parcels.ts` - parcel management
- `use-ratings.ts` - rating management
- `use-rider-profile.ts` - rider profile

### Dashboard Patterns
- **Customer Dashboard**: Server component, uses `getUserDashboard()` from user.server.ts (SSR)
- **Rider Dashboard**: Server component, uses `getRiderDashboard()` from rider.server.ts (SSR)
- **Profile/Settings**: Server component with HydrationBoundary, prefetches data, renders client component

### API Endpoints for Admin Dashboard (from API docs)

#### User Management
- `GET /api/v1/users` - List all users with search and pagination (ADMIN, SUPER_ADMIN)
- `GET /api/v1/users/:id` - Get specific user by ID (ADMIN, SUPER_ADMIN)
- `PATCH /api/v1/users/:id/role` - Update user role (SUPER_ADMIN only)
- `PATCH /api/v1/users/:id/status` - Update user status (ADMIN, SUPER_ADMIN)

#### Rider Management
- `GET /api/v1/cashouts` - Get all cashouts with filtering (ADMIN, SUPER_ADMIN)
- `PATCH /api/v1/cashouts/:id` - Update cashout status (ADMIN, SUPER_ADMIN)

#### Parcel Management
- `GET /api/v1/parcels` - Get all parcels with filters (ADMIN, SUPER_ADMIN)
- `GET /api/v1/parcels/available` - Get available parcels for assignment (ADMIN, SUPER_ADMIN)
- `PATCH /api/v1/parcels/:id/assign-rider` - Assign rider to parcel (ADMIN, SUPER_ADMIN)
- `PATCH /api/v1/parcels/:id/status` - Update parcel status manually (ADMIN, SUPER_ADMIN)

#### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard overview metrics (ADMIN, SUPER_ADMIN)
- `GET /api/v1/analytics/revenue` - Revenue analytics with breakdowns (ADMIN, SUPER_ADMIN)

## Implementation Tasks

### Task 1: Create admin.server.ts Service
**Location**: `/src/services/admin.server.ts`

**Functions to implement**:
- `getAdminDashboard()` - GET /analytics/dashboard
- `getAdminRevenueAnalytics(startDate?, endDate?)` - GET /analytics/revenue
- `getAllUsers(search?, page?, limit?)` - GET /users
- `getUserById(id)` - GET /users/:id
- `updateUserRole(id, role)` - PATCH /users/:id/role
- `updateUserStatus(id, status)` - PATCH /users/:id/status
- `getAllParcels(status?, district?, date?, page?, limit?)` - GET /parcels
- `getAvailableParcels(page?, limit?)` - GET /parcels/available
- `assignRiderToParcel(id, riderId, note?)` - PATCH /parcels/:id/assign-rider
- `updateParcelStatus(id, status, note?)` - PATCH /parcels/:id/status
- `getAllCashouts(status?, startDate?, endDate?, page?, limit?)` - GET /cashouts
- `updateCashoutStatus(id, status)` - PATCH /cashouts/:id

**TypeScript Interfaces**:
- AdminDashboardData, AdminDashboardResponse
- RevenueAnalyticsData, RevenueAnalyticsResponse
- User, UsersResponse, UsersMeta
- UpdateUserRoleResponse, UpdateUserStatusResponse
- AdminParcel, AdminParcelsResponse, AdminParcelsMeta
- AssignRiderResponse, UpdateParcelStatusResponse
- AdminCashout, AdminCashoutsResponse, AdminCashoutsMeta
- UpdateCashoutStatusResponse

---

### Task 2: Create admin.service.ts Service
**Location**: `/src/services/admin.service.ts`

**Functions to implement** (using apiClient for client-side operations):
- Same functions as admin.server.ts but using apiClient instead of serverFetch
- Used for mutations and client-side data fetching in interactive components

---

### Task 3: Create Admin Hooks
**Location**: `/src/hooks/use-admin-users.ts`, `/src/hooks/use-admin-parcels.ts`, `/src/hooks/use-admin-cashouts.ts`, `/src/hooks/use-admin-analytics.ts`

**Hooks to implement**:

#### use-admin-users.ts
- `useAdminUsers(params)` - useQuery for getAllUsers
- `useAdminUser(id)` - useQuery for getUserById
- `useUpdateUserRole()` - useMutation for updateUserRole
- `useUpdateUserStatus()` - useMutation for updateUserStatus

#### use-admin-parcels.ts
- `useAdminParcels(params)` - useQuery for getAllParcels
- `useAvailableParcels(params)` - useQuery for getAvailableParcels
- `useAssignRider()` - useMutation for assignRiderToParcel
- `useUpdateParcelStatus()` - useMutation for updateParcelStatus

#### use-admin-cashouts.ts
- `useAdminCashouts(params)` - useQuery for getAllCashouts
- `useUpdateCashoutStatus()` - useMutation for updateCashoutStatus

#### use-admin-analytics.ts
- `useAdminDashboard()` - useQuery for getAdminDashboard
- `useAdminRevenueAnalytics(params)` - useQuery for getAdminRevenueAnalytics

---

### Task 4: Implement /admin-dashboard Page (Main Dashboard)
**Location**: `/src/app/(dashboard)/admin-dashboard/page.tsx`

**Pattern**: Server component (SSR) like customer/rider dashboards

**Implementation**:
- Import `getAdminDashboard` from admin.server.ts
- Fetch dashboard data server-side
- Display overview stats with StatsCardBasic and StatsCardTrend
- Display charts (ChartArea, ChartBarVertical, ChartPie) for analytics
- Use shadcn/ui components for layout

**Components needed**:
- Stats cards for: Total Parcels, Total Users, Total Riders, Total Revenue, Active Riders, Pending Parcels, etc.
- Revenue chart (last 7/30 days)
- Parcel status distribution pie chart
- User growth chart

---

### Task 5: Implement /admin-dashboard/users Page
**Location**: `/src/app/(dashboard)/admin-dashboard/users/page.tsx`

**Pattern**: Server component with HydrationBoundary (for interactive table)

**Implementation**:
- Server component prefetches user list data
- Client component renders user table with:
  - Search functionality
  - Pagination
  - Role badge
  - Status badge
  - Actions (View, Update Role, Update Status)
- Use shadcn/ui Table component
- Use useAdminUsers hook for data fetching
- Use useUpdateUserRole and useUpdateUserStatus for mutations

**Sub-routes**:
- `/admin-dashboard/users/[id]` - User details page with actions

---

### Task 6: Implement /admin-dashboard/users/[id] Page
**Location**: `/src/app/(dashboard)/admin-dashboard/users/[id]/page.tsx`

**Pattern**: Server component with HydrationBoundary

**Implementation**:
- Server component prefetches user details
- Client component renders:
  - User information card
  - Role update form (SUPER_ADMIN only)
  - Status update form (ADMIN, SUPER_ADMIN)
  - User's parcels list
  - User activity history

---

### Task 7: Implement /admin-dashboard/riders Page
**Location**: `/src/app/(dashboard)/admin-dashboard/riders/page.tsx`

**Pattern**: Server component with HydrationBoundary

**Implementation**:
- Server component prefetches riders (filtered by role: RIDER)
- Client component renders rider table with:
  - Rider information
  - Account status (PENDING, ACTIVE, SUSPENDED, REJECTED)
  - Current status (AVAILABLE, BUSY, OFFLINE)
  - Rating
  - Total deliveries
  - Actions (View, Update Account Status)
- Tab for Cashouts management

**Sub-routes**:
- `/admin-dashboard/riders/cashouts` - All cashouts management (can be separate page or tab)

---

### Task 8: Implement /admin-dashboard/parcels Page
**Location**: `/src/app/(dashboard)/admin-dashboard/parcels/page.tsx`

**Pattern**: Server component with HydrationBoundary

**Implementation**:
- Server component prefetches parcels with filters
- Client component renders parcel table with:
  - Tracking ID
  - Customer info
  - Pickup/Delivery addresses
  - Districts
  - Status
  - Price
  - Assigned rider
  - Actions (View, Assign Rider, Update Status)
- Filter by status, district, date
- Pagination

**Sub-routes**:
- `/admin-dashboard/parcels/available` - Available parcels for assignment
- `/admin-dashboard/parcels/[id]` - Parcel details page

---

### Task 9: Implement /admin-dashboard/parcels/available Page
**Location**: `/src/app/(dashboard)/admin-dashboard/parcels/available/page.tsx`

**Pattern**: Server component with HydrationBoundary

**Implementation**:
- Server component prefetches available parcels
- Client component renders available parcels table
- Assign rider functionality with rider selection dropdown
- Bulk assignment option

---

### Task 10: Implement /admin-dashboard/analytics Page
**Location**: `/src/app/(dashboard)/admin-dashboard/analytics/page.tsx`

**Pattern**: Server component (SSR)

**Implementation**:
- Server component fetches revenue analytics
- Display:
  - Revenue summary cards
  - Revenue by payment method chart
  - Revenue by district chart
  - Revenue over time chart
  - Date range picker for filtering

---

### Task 11: Implement /admin-dashboard/profile Page
**Location**: `/src/app/(dashboard)/admin-dashboard/profile/page.tsx`

**Pattern**: Server component with HydrationBoundary (like customer/rider profile)

**Implementation**:
- Server component prefetches admin profile data using authService.getMe()
- Client component renders:
  - Personal information card
  - Account details card
  - Edit profile dialog
  - Role badge (ADMIN/SUPER_ADMIN)
  - Status badge
- Reuse existing profile components or create admin-specific version

---

### Task 12: Implement /admin-dashboard/settings Page
**Location**: `/src/app/(dashboard)/admin-dashboard/settings/page.tsx`

**Pattern**: Server component with HydrationBoundary (like rider settings)

**Implementation**:
- Server component prefetches admin profile data
- Client component renders:
  - Account settings form
  - Notification preferences
  - Security settings (change password)
  - Theme settings (if applicable)
- Reuse existing SettingsContent component or create admin-specific version

---

### Task 13: Create Admin-Specific Components
**Location**: `/src/components/dashboard/admin/`

**Components needed**:
- `AdminUserTable.tsx` - User management table
- `AdminRiderTable.tsx` - Rider management table
- `AdminParcelTable.tsx` - Parcel management table
- `AdminCashoutTable.tsx` - Cashout management table
- `UserDetailsCard.tsx` - User details display
- `RiderDetailsCard.tsx` - Rider details display
- `ParcelDetailsCard.tsx` - Parcel details display
- `AssignRiderDialog.tsx` - Rider assignment dialog
- `UpdateUserRoleDialog.tsx` - Role update dialog
- `UpdateUserStatusDialog.tsx` - Status update dialog
- `UpdateCashoutStatusDialog.tsx` - Cashout status update dialog
- `UpdateParcelStatusDialog.tsx` - Parcel status update dialog
- `AdminStatsCard.tsx` - Admin-specific stats card

---

## Route Structure

```
/admin-dashboard
├── / (main dashboard with analytics)
├── /users
│   ├── / (list all users)
│   └── /[id] (user details)
├── /riders
│   ├── / (list riders)
│   └── /cashouts (cashout management)
├── /parcels
│   ├── / (all parcels with filters)
│   ├── /available (available for assignment)
│   └── /[id] (parcel details)
├── /analytics
│   ├── /dashboard (overview metrics)
│   └── /revenue (revenue analytics)
├── /profile
└── /settings
```

## Design System Requirements

- Use shadcn/ui components exclusively
- Use Lucide React icons
- Use existing shared components (StatsCardBasic, StatsCardTrend, ChartArea, ChartBarVertical, ChartPie)
- Use StatusBadge component for status display
- Use InputField for form inputs
- Use SubmitButton for form submissions
- Use Dialog for modals
- Use Table for data tables
- Use Badge for role/status badges

## API Call Patterns

### SSR (Server Components)
```typescript
import { getAdminDashboard } from "@/services/admin.server";

export default async function AdminDashboardPage() {
  const response = await getAdminDashboard();
  // Render with data
}
```

### CSR with Hydration (Interactive Components)
```typescript
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { ADMIN_DASHBOARD_KEY } from "@/hooks/use-admin-analytics";

export default async function AdminUsersPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: () => getAdminDashboard(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUsersContent />
    </HydrationBoundary>
  );
}
```

### Client Components (Interactive)
```typescript
"use client";

import { useAdminUsers } from "@/hooks/use-admin-users";

export function AdminUsersContent() {
  const { data, isLoading } = useAdminUsers({ page: 1, limit: 10 });
  // Render interactive UI
}
```

## Notes

- All server components use `.server.ts` services with `serverFetch`
- All client components use `.service.ts` services with `apiClient`
- All mutations use TanStack Query with queryClient.invalidateQueries on success
- All forms use react-hook-form with zod validation
- All error handling uses toast notifications (sonner)
- All loading states use skeleton components
- Follow existing code patterns from customer/rider dashboards

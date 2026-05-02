# NexDrop 

A modern, full-featured parcel delivery management system built with Next.js 16, TypeScript, and shadcn/ui. This is the frontend application for the NexDrop platform, providing comprehensive dashboards for customers, riders, and administrators.

## Live Demo

- **Frontend**: https://nex-drop-client.vercel.app/
- **Backend**: https://nexdrop-backend.vercel.app/

## Repository Links

- **Frontend Repository**: https://github.com/mdmhrz/nex-drop-client
- **Backend Repository**: https://github.com/mdmhrz/nexdrop-backend

## Features

### Customer Dashboard
- Create and manage parcel deliveries
- Track parcels in real-time with status updates
- View delivery history and analytics
- Manage saved addresses
- Handle payments securely
- Apply to become a rider
- Profile management with edit capabilities

### Rider Dashboard
- View available parcels for delivery
- Accept and manage assigned deliveries
- Track earnings and payment history
- Request cashouts
- Manage availability status (Available/Busy/Offline)
- View ratings and reviews
- Profile management

### Admin Dashboard
- Comprehensive analytics and reporting
- User management (customers, riders, admins)
- Rider application approvals
- Parcel management and tracking
- Cashout request processing
- Revenue analytics with charts
- System-wide monitoring

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Role-based access control (RBAC)
- Email verification system
- Password reset functionality
- Secure token refresh mechanism
- Protected routes with middleware
- Demo login for development/testing

### Public Pages
- Landing page with service information
- Coverage area information
- Contact form
- About page
- Privacy policy and terms of service
- Cookie policy
- Track order without login

## Tech Stack

### Core Framework
- **Next.js 16.1.7** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5.9.3** - Type safety

### Styling & UI
- **Tailwind CSS 4.2.1** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **next-themes** - Theme management

### State Management & Data Fetching
- **TanStack Query 5.100.1** - Server state management
- **TanStack React Form 1.29.1** - Form state management
- **Axios 1.15.2** - HTTP client

### Form Handling & Validation
- **React Hook Form 7.73.1** - Form management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers 5.2.2** - Form validation integration

### Maps & Location
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 5.0.0** - React integration for Leaflet
- **@bangladeshi/bangladesh-address 2.1.0** - Bangladesh address data

### Data Visualization
- **Recharts 3.8.0** - Chart library
- **TanStack React Table 8.21.3** - Table component

### UI Components
- **Radix UI** - Unstyled, accessible components
- **Sonner 2.0.7** - Toast notifications
- **cmdk 1.1.1** - Command palette
- **Embla Carousel 8.6.0** - Carousel component
- **Swiper 12.1.3** - Touch slider

### Development Tools
- **ESLint 9.39.4** - Code linting
- **Prettier 3.8.1** - Code formatting
- **PostCSS 8** - CSS processing

## Project Structure

```
nex-drop-client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── dashboard/     # Customer dashboard
│   │   │   ├── rider-dashboard/ # Rider dashboard
│   │   │   └── admin-dashboard/ # Admin dashboard
│   │   ├── (public)/          # Public pages
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── track-order/
│   │   │   └── coverage/
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── rider/
│   │   ├── home/              # Homepage components
│   │   ├── layouts/           # Layout components
│   │   ├── shared/            # Shared/reusable components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── apiClient.ts       # Axios client configuration
│   │   ├── auth.ts            # Authentication utilities
│   │   └── utils.ts           # General utilities
│   ├── services/              # API service layer
│   │   ├── *.server.ts        # Server-side services (SSR)
│   │   └── *.service.ts       # Client-side services (CSR)
│   ├── types/                 # TypeScript type definitions
│   └── provider/              # Context providers
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Architecture

### 3-Layer Separation

The project follows a clear separation of concerns:

1. **UI Layer** - React Components (Server and Client Components)
2. **State Layer** - TanStack Query for client-server state management
3. **Data Layer** - API Services (fetch/axios wrappers)

### Server-Side Rendering Strategy

- **SSR (Server-Side Rendering)**: Uses `fetch` with `{ cache: "no-store" }` for dynamic data
- **SSG (Static Site Generation)**: Uses `fetch` with `{ cache: "force-cache" }` for static content
- **ISR (Incremental Static Regeneration)**: Uses `fetch` with `{ next: { revalidate: 60 } }` for semi-static data
- **Tag-Based Revalidation**: Uses `fetch` with `{ next: { tags: ["key"] } }` for manual cache invalidation

### Component Architecture

- **Pages (page.tsx)**: Server Components by default
- **Interactive Components**: Client Components with "use client" directive
- **Forms, Hooks, State**: Extracted to separate client components
- **Client components imported into server component pages**

### Data Fetching Patterns

**Server Components (SSR)**
```typescript
import { getAdminDashboard } from "@/services/admin.server";

export default async function AdminDashboardPage() {
  const response = await getAdminDashboard();
  // Render with data
}
```

**Client Components with Hydration (Interactive)**
```typescript
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["key"],
    queryFn: () => fetchData(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

**Client Components (TanStack Query)**
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

export function ClientComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["key"],
    queryFn: () => fetchData(),
  });
  // Render interactive UI
}
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (recommended)
- Backend API running (https://github.com/mdmhrz/nexdrop-backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mdmhrz/nex-drop-client.git
cd nex-drop-client
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_VERSION=v1
FRONTEND_BASE_URL=http://localhost:3000
BACKEND_BASE_URL=http://localhost:5000
API_URL=http://localhost:5000/api/v1
AUTH_URL=http://localhost:5000/api/v1/auth
API_VERSION=v1

# Demo Login (Development Only)
NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=admin@demo.com
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=Admin@123
NEXT_PUBLIC_DEMO_RIDER_EMAIL=rider@demo.com
NEXT_PUBLIC_DEMO_RIDER_PASSWORD=Rider@123
NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL=customer@demo.com
NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD=Customer@123
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

## Design System

This project uses shadcn/ui as the design system. All UI components are built using shadcn/ui components rather than custom implementations.

### Adding Components

To add new shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
```

### Using Components

Import components from the UI directory:
```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Table } from "@/components/ui/table";
```

## Authentication

The application uses JWT-based authentication with HTTP-only cookies for security.

### Features

- JWT access tokens with expiration
- Refresh token mechanism
- HTTP-only cookies (no localStorage)
- Role-based access control
- Email verification
- Password reset
- Protected routes with middleware

### User Roles

- **CUSTOMER** - Regular users who create parcels
- **RIDER** - Delivery personnel
- **ADMIN** - Platform administrators
- **SUPER_ADMIN** - Full system access

### Protected Routes

Routes are protected based on user roles:
- `/dashboard/*` - Customer only
- `/rider-dashboard/*` - Rider only
- `/admin-dashboard/*` - Admin only

## API Integration

The frontend communicates with the backend REST API. API calls are organized in the services layer:

- **Server Services** (*.server.ts) - For SSR data fetching
- **Client Services** (*.service.ts) - For client-side operations
- **Hooks** - TanStack Query wrappers for components

### Example Service

```typescript
// services/parcel.service.ts
import { api } from "@/lib/apiClient";

export async function getParcels(params?: ParcelFilters) {
  return api.get<ParcelsResponse>("/parcels", { params });
}
```

### Example Hook

```typescript
// hooks/use-parcels.ts
import { useQuery } from "@tanstack/react-query";
import { getParcels } from "@/services/parcel.service";

export function useParcels(params?: ParcelFilters) {
  return useQuery({
    queryKey: ["parcels", params],
    queryFn: () => getParcels(params),
  });
}
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure these are set in your production environment:
- `NEXT_PUBLIC_BACKEND_BASE_URL` - Production backend URL
- `NEXT_PUBLIC_FRONTEND_BASE_URL` - Production frontend URL
- `NEXT_PUBLIC_API_VERSION` - API version
- All other variables from `.env.example`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use Prettier for formatting
- Run ESLint before committing
- Keep components small and focused
- Use shadcn/ui components for UI

## License

This project is licensed under the MIT License.

## Support

For support, email razufreelance@gmail.com or open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Maps powered by [Leaflet](https://leafletjs.com/)

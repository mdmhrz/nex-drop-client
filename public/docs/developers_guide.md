# Next.js API Architecture & Data Flow Guide

## 1. Core Principle

This project separates responsibilities into 3 layers:

```
UI Layer (React Components)
        ↓
State Layer (TanStack Query - Client Server State)
        ↓
Data Layer (API Services - fetch/axios wrappers)
        ↓
Backend API
```

## 2. Folder Structure

```
/app
  /dashboard
  /users
  layout.tsx
  page.tsx

/lib
  /api
    fetchClient.ts        # native fetch wrapper (server-first)
    apiClient.ts          # axios client (optional, only if needed)
  /utils
    revalidate.ts

/services
  user.service.ts
  auth.service.ts
  product.service.ts

/hooks
  useUsers.ts
  useUser.ts

/types
  user.types.ts
  api.types.ts
```

## 3. Server Data Strategy (Next.js Fetch Rules)

✅ **ALWAYS prefer fetch in Server Components**

### 3.1 SSR (Server-Side Rendering)

```typescript
await fetch("https://api.com/users", {
  cache: "no-store",
});
```

**Use when:**
- Dynamic data
- Always fresh data

### 3.2 SSG (Static Site Generation)

```typescript
await fetch("https://api.com/users", {
  cache: "force-cache",
});
```

**Use when:**
- Data rarely changes
- Blogs, landing pages

### 3.3 ISR (Incremental Static Regeneration)

```typescript
await fetch("https://api.com/products", {
  next: {
    revalidate: 60, // seconds
  },
});
```

**Use when:**
- Semi-static data
- Product lists, categories

### 3.4 Tag-Based Revalidation

```typescript
await fetch("https://api.com/users", {
  next: {
    tags: ["users"],
  },
});
```

Revalidate manually:
```typescript
import { revalidateTag } from "next/cache";

revalidateTag("users");
```

## 4. Fetch Client Wrapper (Server)

**File:** `/lib/api/fetchClient.ts`

```typescript
export const fetchClient = async <T>(
  url: string,
  options?: RequestInit & { next?: any }
): Promise<T> => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
};
```

## 5. Client Side Data (TanStack Query)

**RULE:** All interactive / UI-driven data MUST use TanStack Query

### Example: GET USERS

**File:** `/services/user.service.ts`
```typescript
import { fetchClient } from "@/lib/api/fetchClient";
import { User } from "@/types/user.types";

export const getUsers = async (): Promise<User[]> => {
  return fetchClient<User[]>("https://api.com/users");
};
```

**File:** `/hooks/useUsers.ts`
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user.service";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10,
  });
};
```

**Component usage:**
```typescript
"use client";

import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
  const { data, isLoading } = useUsers();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {data?.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}
```

## 6. Mutations (Create / Update / Delete)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/user.service";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
```

## 7. API Layer Rules

❌ **NEVER:**
- Call fetch inside components (client)
- Mix axios + fetch randomly
- Use TanStack for local UI state

✅ **ALWAYS:**
- Services handle API calls
- Hooks handle TanStack Query
- Components only render UI

## 8. When to Use What

| Case | Tool |
|------|------|
| Server page data | fetch |
| Static page (SSG) | fetch + force-cache |
| ISR content | fetch + revalidate |
| UI interactive data | TanStack Query |
| Form submit | service + mutation |
| Auth requests | service layer |

## 9. Auth Rule

- Use httpOnly cookies ONLY
- Never store tokens in localStorage
- No manual cookie parsing in client

## 10. Final Architecture

```
Server Component
    ↓ fetch (SSR / SSG / ISR)

Client Component
    ↓ TanStack Query
    ↓ Services
    ↓ fetchClient
```

## 11. Golden Rules (IMPORTANT)

- Server = fetch (Next.js native)
- Client = TanStack Query
- API logic = services only
- UI never calls API directly
- Caching strategy always defined at fetch level
- Mutations always invalidate query cache

## Summary

This architecture ensures:
- Scalable frontend
- Clean separation of concerns
- Optimal Next.js performance
- Predictable data flow
- Production-grade maintainability

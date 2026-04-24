// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { UserRole, getDashboardRedirect } from "./lib/rbac";

// // TODO: Replace with actual auth logic to get user role from session/token
// function getUserRole(request: NextRequest): UserRole | null {
//   // Placeholder - implement actual auth check
//   // You might check cookies, headers, or session
//   // const token = request.cookies.get("auth_token")?.value;
//   // if (!token) return null;
//   return "CUSTOMER"

//   // Decode token and return role
//   // For now, return null as placeholder
//   return null;
// }

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const userRole = getUserRole(request);

//   // Public routes - allow access
//   if (pathname === "/" || pathname.startsWith("/(public)")) {
//     // If user is authenticated and tries to access public routes, you might want to redirect
//     // For now, allow access
//     return NextResponse.next();
//   }

//   // Auth routes - redirect if already authenticated
//   if (pathname.startsWith("/login")) {
//     if (userRole) {
//       const redirectUrl = getDashboardRedirect(userRole);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     return NextResponse.next();
//   }

//   // Dashboard routes - require authentication and role-based access
//   if (pathname.startsWith("/dashboard")) {
//     if (!userRole) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     if (userRole !== "CUSTOMER") {
//       const redirectUrl = getDashboardRedirect(userRole);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/rider-dashboard")) {
//     if (!userRole) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     if (userRole !== "RIDER") {
//       const redirectUrl = getDashboardRedirect(userRole);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/admin-dashboard")) {
//     if (!userRole) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
//       const redirectUrl = getDashboardRedirect(userRole);
//       return NextResponse.redirect(new URL(redirectUrl, request.url));
//     }
//     return NextResponse.next();
//   }

//   // Default - allow access
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

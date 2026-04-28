import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    UserRole,
} from "./lib/authUtils";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;

    // Decode token without verification in middleware
    // Actual verification happens server-side
    const decoded = accessToken ? jwtUtils.decodedToken(accessToken) : null;
    const isValidAccessToken = !!decoded;

    const rawRole = decoded?.role as UserRole | undefined;
    const userRole: UserRole | null = rawRole || null;

    const emailVerified = decoded?.emailVerified ?? false;

    const routeOwner = getRouteOwner(pathname);
    const authRoute = isAuthRoute(pathname);

    console.log("=== Proxy Debug ===");
    console.log(`Pathname: ${pathname}`);
    console.log(`User Role: ${userRole}`);
    console.log(`Route Owner: ${routeOwner}`);
    console.log(`Is Auth Route: ${authRoute}`);
    console.log(`Is Valid Token: ${isValidAccessToken}`);

    // Protect payment pages: require a valid accessToken and a session_id query param
    if (pathname.startsWith("/payment")) {
        // Allow showing the fail page to give users a reason
        if (pathname === "/payment/fail") {
            return NextResponse.next();
        }

        const sessionId = request.nextUrl.searchParams.get("session_id");

        // If user is not authenticated, send them to login
        if (!isValidAccessToken || !userRole) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // If session_id missing, show an unauthorized/fail page
        if (!sessionId) {
            const failUrl = new URL("/payment/fail", request.url);
            failUrl.searchParams.set("error", "Missing session_id");
            return NextResponse.redirect(failUrl);
        }

        return NextResponse.next();
    }

    // Be a Rider: public route but blocked for riders
    if (pathname === "/be-a-rider" || pathname.startsWith("/be-a-rider/")) {
        if (isValidAccessToken && userRole === "RIDER") {
            return NextResponse.redirect(
                new URL(getDefaultDashboardRoute(userRole), request.url)
            );
        }
        return NextResponse.next();
    }

    // Verify Email Page
    if (pathname === "/verify-email") {
        if (!isValidAccessToken) {
            return NextResponse.next();
        }
        if (emailVerified) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole!), request.url));
        }
        return NextResponse.next();
    }

    // Block logged-in users from auth pages
    if (isValidAccessToken && authRoute) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
    }

    // Public routes
    if (routeOwner === null) {
        return NextResponse.next();
    }

    // Protect all other routes
    if (!isValidAccessToken || !userRole) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Common routes allowed for all logged-in users
    if (routeOwner === "COMMON") {
        return NextResponse.next();
    }

    // Role-based access control
    if (routeOwner) {
        // If the required role matches user's role, allow
        if (routeOwner === userRole) {
            return NextResponse.next();
        }

        // Only SUPER_ADMIN can access ADMIN routes
        if (routeOwner === "ADMIN" && userRole === "SUPER_ADMIN") {
            return NextResponse.next();
        }

        // No other role escalation allowed
        // Redirect to user's own dashboard
        console.log(`Access denied: ${userRole} tried to access ${routeOwner} route`);
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole), request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
    ],
};

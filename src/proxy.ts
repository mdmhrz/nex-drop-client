import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    UserRole,
} from "./lib/authUtils";

// Refresh the access token proactively if it expires within this window
const REFRESH_THRESHOLD_SECONDS = 5 * 60; // 5 minutes

// Cookie lifetimes (seconds)
const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60;     // 1 day
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

interface FreshTokens {
    accessToken: string;
    refreshToken: string;
    sessionToken: string;
}

async function tryRefreshTokens(request: NextRequest): Promise<FreshTokens | null> {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;

    if (!refreshToken || !sessionToken) return null;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/refresh-token`,
            {
                method: "POST",
                headers: {
                    Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
                },
            }
        );
        if (!res.ok) return null;
        const body = await res.json();
        return body.data ?? null;
    } catch {
        return null;
    }
}

function applyCookies(response: NextResponse, tokens: FreshTokens): NextResponse {
    const isProduction = process.env.NODE_ENV === "production";
    const base = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
        path: "/",
    };
    response.cookies.set("accessToken", tokens.accessToken, { ...base, maxAge: ACCESS_TOKEN_MAX_AGE });
    response.cookies.set("refreshToken", tokens.refreshToken, { ...base, maxAge: REFRESH_TOKEN_MAX_AGE });
    response.cookies.set("better-auth.session_token", tokens.sessionToken, { ...base, maxAge: REFRESH_TOKEN_MAX_AGE });
    return response;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    let accessToken = request.cookies.get("accessToken")?.value;
    let decoded = accessToken ? jwtUtils.decodedToken(accessToken) : null;
    let freshTokens: FreshTokens | null = null;

    // ── Proactive refresh ──────────────────────────────────────────────────
    // Refresh if token is missing OR expires within the threshold window
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded?.exp ?? 0;
    if (!decoded || exp - now < REFRESH_THRESHOLD_SECONDS) {
        freshTokens = await tryRefreshTokens(request);
        if (freshTokens) {
            accessToken = freshTokens.accessToken;
            decoded = jwtUtils.decodedToken(accessToken);
        }
    }
    // ──────────────────────────────────────────────────────────────────────

    const isValidAccessToken = !!decoded && (decoded.exp ?? 0) > now;
    const rawRole = decoded?.role as UserRole | undefined;
    const userRole: UserRole | null = rawRole || null;
    const emailVerified = decoded?.emailVerified ?? false;

    const routeOwner = getRouteOwner(pathname);
    const authRoute = isAuthRoute(pathname);

    // Attach refreshed cookies to any response before returning
    const fin = (res: NextResponse) => freshTokens ? applyCookies(res, freshTokens) : res;

    // ── Payment pages ──────────────────────────────────────────────────────
    if (pathname.startsWith("/payment")) {
        if (pathname === "/payment/fail") {
            return fin(NextResponse.next());
        }
        const sessionId = request.nextUrl.searchParams.get("session_id");
        if (!isValidAccessToken || !userRole) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return fin(NextResponse.redirect(loginUrl));
        }
        if (!sessionId) {
            const failUrl = new URL("/payment/fail", request.url);
            failUrl.searchParams.set("error", "Missing session_id");
            return fin(NextResponse.redirect(failUrl));
        }
        return fin(NextResponse.next());
    }

    // ── Be a Rider ─────────────────────────────────────────────────────────
    if (pathname === "/be-a-rider" || pathname.startsWith("/be-a-rider/")) {
        if (isValidAccessToken && userRole === "RIDER") {
            return fin(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url)));
        }
        return fin(NextResponse.next());
    }

    // ── Verify Email ───────────────────────────────────────────────────────
    if (pathname === "/verify-email") {
        if (!isValidAccessToken) {
            return fin(NextResponse.next());
        }
        if (emailVerified) {
            return fin(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole!), request.url)));
        }
        return fin(NextResponse.next());
    }

    // ── Block logged-in users from auth pages ──────────────────────────────
    if (isValidAccessToken && authRoute) {
        return fin(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
    }

    // ── Public routes ──────────────────────────────────────────────────────
    if (routeOwner === null) {
        return fin(NextResponse.next());
    }

    // ── Require authentication ─────────────────────────────────────────────
    if (!isValidAccessToken || !userRole) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return fin(NextResponse.redirect(loginUrl));
    }

    // ── Common routes (all authenticated roles) ────────────────────────────
    if (routeOwner === "COMMON") {
        return fin(NextResponse.next());
    }

    // ── Role-based access control ──────────────────────────────────────────
    if (routeOwner) {
        if (routeOwner === userRole) {
            return fin(NextResponse.next());
        }
        // SUPER_ADMIN can access ADMIN routes
        if (routeOwner === "ADMIN" && userRole === "SUPER_ADMIN") {
            return fin(NextResponse.next());
        }
        return fin(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url)));
    }

    return fin(NextResponse.next());
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
    ],
};

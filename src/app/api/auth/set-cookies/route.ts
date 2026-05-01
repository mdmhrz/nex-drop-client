import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/set-cookies?accessToken=...&refreshToken=...&redirect=/dashboard
 *
 * Called by the backend after Google OAuth completes. Because the backend and
 * frontend are on different domains in production, the backend cannot set
 * cookies on the frontend domain directly. Instead, it redirects here with
 * tokens in the query string, and we set the cookies on the frontend domain
 * before forwarding the user to their destination.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const redirect = searchParams.get("redirect") || "/dashboard";

    if (!accessToken || !refreshToken) {
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    // Validate redirect path — must be a relative path, never an external URL
    const isValidRedirect = redirect.startsWith("/") && !redirect.startsWith("//");
    const destination = isValidRedirect ? redirect : "/dashboard";

    const response = NextResponse.redirect(new URL(destination, request.url));

    const isProduction = process.env.NODE_ENV === "production";
    const base = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
        path: "/",
    };

    response.cookies.set("accessToken", accessToken, { ...base, maxAge: 24 * 60 * 60 });       // 1 day
    response.cookies.set("refreshToken", refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 });   // 7 days

    return response;
}

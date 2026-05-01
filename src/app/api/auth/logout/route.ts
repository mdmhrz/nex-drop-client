import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Clears all auth-related httpOnly cookies on the frontend domain.
 * Called by the client-side axios interceptor when a token refresh fails,
 * since httpOnly cookies can't be deleted directly from JavaScript.
 */
export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("better-auth.session_token");
    return response;
}

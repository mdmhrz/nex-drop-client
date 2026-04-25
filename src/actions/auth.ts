"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // Fire-and-forget: notify backend to invalidate the session.
    // We do NOT await — cookie deletion + redirect happens instantly.
    if (accessToken) {
        fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/logout`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}`,
                },
            }
        ).catch((error) => console.error("Backend logout error:", error));
    }

    // Delete cookies directly on the Next.js server — no domain mismatch.
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/login");
}

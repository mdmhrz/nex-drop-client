import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

type FetchOptions = RequestInit & {
    auth?: boolean;
    timeout?: number; // timeout in ms, defaults to 30s
};

export async function serverFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { auth = true, timeout = 30000, headers, ...rest } = options;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(
            `${env.BACKEND_BASE_URL}/api/${env.API_VERSION}${endpoint}`,
            {
                cache: "no-store",
                ...rest,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(auth && { Cookie: cookieHeader }),
                    ...headers,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return response.json();
    } finally {
        clearTimeout(timeoutId);
    }
}

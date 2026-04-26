import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

type FetchOptions = RequestInit & {
    auth?: boolean;
};

export async function serverFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { auth = true, headers, ...rest } = options;
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
        `${env.BACKEND_BASE_URL}/api/${env.API_VERSION}${endpoint}`,
        {
            cache: "no-store",
            ...rest,
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
}

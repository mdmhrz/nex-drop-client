import "./src/env"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */


    async rewrites() {
        return [
            {
                source: "/api/v1/auth/:path*",
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/:path*`,
            },
        ];
    }
};

export default nextConfig;
import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    FRONTEND_BASE_URL: z.string().url().optional(),
    BACKEND_BASE_URL: z.string().url().optional(),
    API_URL: z.string().url().optional(),
    AUTH_URL: z.string().url().optional(),
    API_VERSION: z.string().default("v1"),
  },

  client: {
    NEXT_PUBLIC_BACKEND_BASE_URL: z.string().url(),
    NEXT_PUBLIC_FRONTEND_BASE_URL: z.string().url(),
    NEXT_PUBLIC_API_VERSION: z.string().default("v1"),
  },

  runtimeEnv: {
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,
    API_VERSION: process.env.API_VERSION,
    NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    NEXT_PUBLIC_FRONTEND_BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
  },
});

// console.log("ENV:", env);

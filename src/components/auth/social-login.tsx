"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SocialLoginProps {
  redirectPath?: string | null;
}

export function SocialLogin({ redirectPath }: SocialLoginProps) {
  const handleGoogleLogin = async () => {
    // TODO: Implement Google login logic
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const googleAuthUrl = `${baseUrl}/auth/login/google`;
    const defaultRedirect = "/dashboard";

    window.location.href = googleAuthUrl + `?redirect=${encodeURIComponent(redirectPath || defaultRedirect)}`;
  };

  return (
    <div className="w-full space-y-4 mt-2">
      {/* Google Button */}
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        type="button"
        className="w-full py-6 flex items-center justify-center gap-2"
      >
        <Image priority src="/google_logo.svg" alt="google" width={20} height={20} />
        <span>Continue with Google</span>
      </Button>

      {/* OR Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground uppercase">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

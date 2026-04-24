import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthSideText } from "./auth-side-text";
import { Logo } from "@/components/shared/logo";

interface AuthLayoutProps {
  children: ReactNode;
  leftSideTitle?: string;
  leftSideDescription?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

export function AuthLayout({
  children,
  leftSideTitle = "Ship Anywhere, Anytime",
  leftSideDescription = "Experience seamless parcel management with our advanced platform. Track shipments, manage deliveries, and connect with logistics partners effortlessly.",
  backButtonLabel = "Back to Home",
  backButtonHref = "/",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 animate-gradient">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-muted to-primary/30 animate-gradient-slow" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <AuthSideText title={leftSideTitle} description={leftSideDescription} />
        </div>

        <div className="relative z-10 text-muted-foreground text-sm">
          © 2024 NexDrop. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth Content */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header with Logo and Back Button */}
        <div className="p-6 flex items-center justify-between border-b">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <Logo />
          </Link>

          <Link
            href={backButtonHref}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButtonLabel}
          </Link>
        </div>

        {/* Auth Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthSidePanel } from "./auth-side-panel";
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
      {/* Left Side - Branding Panel */}
      <div className="hidden lg:block lg:w-1/2 bg-[#03373D]">
        <AuthSidePanel title={leftSideTitle} description={leftSideDescription} />
      </div>

      {/* Right Side - Auth Content */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header with Logo and Back Button */}
        <div className="p-6 flex items-center justify-between border-b">
          <Link href="/">
            <Logo noLink />
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

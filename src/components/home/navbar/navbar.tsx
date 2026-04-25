import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavMenu } from "@/components/home/navbar/nav-menu";
import { NavigationSheet } from "@/components/home/navbar/navigation-sheet";
import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardHref } from "@/components/home/navbar/nav-items";

const Navbar = async () => {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const dashboardHref = user ? getDashboardHref(user.role) : "/dashboard";

  return (
    <nav className="fixed z-40 inset-x-4 top-6 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-background">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu
          className="hidden md:block"
          isLoggedIn={isLoggedIn}
          role={user?.role}
        />

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href={dashboardHref}>
              <Button className="rounded-full">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet isLoggedIn={isLoggedIn} role={user?.role} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

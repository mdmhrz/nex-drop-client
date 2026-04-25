import { Button } from "@/components/ui/button";

import { NavMenu } from "@/components/home/navbar/nav-menu";
import { NavigationSheet } from "@/components/home/navbar/navigation-sheet";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";

const Navbar = () => {


  return (
    <nav className="fixed z-40 inset-x-4 top-6 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-background">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-flex">
            <Button
              className="hidden rounded-full "
              variant="outline"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="rounded-full">Get Started</Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

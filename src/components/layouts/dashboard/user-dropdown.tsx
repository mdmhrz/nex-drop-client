"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/rbac";
import { logoutAction } from "@/actions/auth";

interface UserDropdownProps {
    user: {
        name?: string;
        email: string;
        role: UserRole;
    };
}

const roleLabels: Record<UserRole, string> = {
    CUSTOMER: "Customer",
    RIDER: "Rider",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
};

const roleBadgeVariants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    CUSTOMER: "secondary",
    RIDER: "outline",
    ADMIN: "default",
    SUPER_ADMIN: "destructive",
};

export function UserDropdown({ user }: UserDropdownProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogoutConfirm = async () => {
        setLogoutDialogOpen(false);
        await logoutAction();
    };

    const handleNavigate = (href: string) => {
        router.push(href);
    };

    const dashboardPrefix = pathname.split("/").slice(0, 2).join("/");

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <UserAvatar name={user.name || user.email} email={user.email} />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="pb-1">
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">{user.name || "User"}</span>
                            <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                            <Badge variant={roleBadgeVariants[user.role]} className="w-fit text-xs mt-1">
                                {roleLabels[user.role]}
                            </Badge>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleNavigate(`${dashboardPrefix}/profile`)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate(`${dashboardPrefix}/settings`)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setLogoutDialogOpen(true)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout? You will be redirected to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogoutConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

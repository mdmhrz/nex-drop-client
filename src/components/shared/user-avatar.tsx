"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserAvatarProps {
    name: string;
    profilePhoto?: string;
}

const avatarColors = [
    "bg-red-100 text-red-700",
    "bg-orange-100 text-orange-700",
    "bg-amber-100 text-amber-700",
    "bg-yellow-100 text-yellow-700",
    "bg-lime-100 text-lime-700",
    "bg-green-100 text-green-700",
    "bg-emerald-100 text-emerald-700",
    "bg-teal-100 text-teal-700",
    "bg-cyan-100 text-cyan-700",
    "bg-sky-100 text-sky-700",
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-purple-100 text-purple-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-pink-100 text-pink-700",
    "bg-rose-100 text-rose-700",
];

function getAvatarColor(name: string): string {
    const charCode = name.charAt(0).toUpperCase().charCodeAt(0);
    return avatarColors[(charCode - 65) % avatarColors.length];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);
}

export function UserAvatar({ name, profilePhoto }: UserAvatarProps) {
    const initials = getInitials(name);
    const colorClass = getAvatarColor(name);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profilePhoto} alt={name} className="object-cover" />
                        <AvatarFallback className={`${colorClass} text-xs font-semibold`}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                    <p className="font-medium">{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

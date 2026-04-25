"use client";

import { useState } from "react";
import { Bell, Package, Truck, CheckCircle, CreditCard, Info, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type NotificationType = "parcel" | "delivery" | "payment" | "system" | "success";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

// Placeholder notifications — replace with real API data
const DEMO_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "parcel",
        title: "New parcel assigned",
        message: "Parcel #NX-00124 has been assigned to you for delivery.",
        time: "2 min ago",
        read: false,
    },
    {
        id: "2",
        type: "delivery",
        title: "Delivery in progress",
        message: "Rider Karim is on the way with your parcel #NX-00118.",
        time: "15 min ago",
        read: false,
    },
    {
        id: "3",
        type: "success",
        title: "Parcel delivered",
        message: "Parcel #NX-00112 was successfully delivered.",
        time: "1 hr ago",
        read: false,
    },
    {
        id: "4",
        type: "payment",
        title: "Payment received",
        message: "Payment of ৳350 for parcel #NX-00108 has been confirmed.",
        time: "3 hr ago",
        read: true,
    },
    {
        id: "5",
        type: "system",
        title: "System maintenance",
        message: "Scheduled maintenance on Apr 27 at 2:00 AM. Expect brief downtime.",
        time: "Yesterday",
        read: true,
    },
    {
        id: "6",
        type: "parcel",
        title: "Parcel picked up",
        message: "Parcel #NX-00101 has been picked up by the rider.",
        time: "2 days ago",
        read: true,
    },
];

const typeConfig: Record<
    NotificationType,
    { icon: React.ElementType; iconClass: string; bgClass: string }
> = {
    parcel: { icon: Package, iconClass: "text-blue-600", bgClass: "bg-blue-50" },
    delivery: { icon: Truck, iconClass: "text-amber-600", bgClass: "bg-amber-50" },
    success: { icon: CheckCircle, iconClass: "text-green-600", bgClass: "bg-green-50" },
    payment: { icon: CreditCard, iconClass: "text-violet-600", bgClass: "bg-violet-50" },
    system: { icon: Info, iconClass: "text-slate-600", bgClass: "bg-slate-100" },
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    const markRead = (id: string) =>
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );

    const dismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 p-0 shadow-lg"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllRead}
                        >
                            <Check className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <Separator />

                {/* List */}
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                        <p className="text-xs text-muted-foreground/60">No notifications yet.</p>
                    </div>
                ) : (
                    <ScrollArea className="h-90">
                        <ul>
                            {notifications.map((notification, i) => {
                                const { icon: Icon, iconClass, bgClass } = typeConfig[notification.type];
                                return (
                                    <li key={notification.id}>
                                        <button
                                            type="button"
                                            onClick={() => markRead(notification.id)}
                                            className={cn(
                                                "group relative w-full flex gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                                                !notification.read && "bg-primary/5 hover:bg-primary/10"
                                            )}
                                        >
                                            {/* Unread dot */}
                                            {!notification.read && (
                                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                                            )}

                                            {/* Icon */}
                                            <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", bgClass)}>
                                                <Icon className={cn("h-4 w-4", iconClass)} />
                                            </span>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <p className={cn("text-sm leading-snug", !notification.read ? "font-semibold" : "font-medium")}>
                                                    {notification.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1 text-[11px] text-muted-foreground/60">{notification.time}</p>
                                            </div>

                                            {/* Dismiss */}
                                            <button
                                                type="button"
                                                onClick={(e) => dismiss(notification.id, e)}
                                                className="invisible shrink-0 self-start mt-0.5 rounded p-0.5 text-muted-foreground/50 hover:text-destructive group-hover:visible"
                                                aria-label="Dismiss notification"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </button>

                                        {i < notifications.length - 1 && <Separator />}
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                )}

                {/* Footer */}
                {notifications.length > 0 && (
                    <>
                        <Separator />
                        <div className="px-4 py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                            >
                                View all notifications
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}

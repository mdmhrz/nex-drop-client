import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType =
    | "success"
    | "error"
    | "warning"
    | "info"
    | "pending"
    | "active"
    | "inactive"
    | "completed"
    | "cancelled"
    | "draft"
    | "published"
    | "archived"
    | string

interface StatusBadgeProps {
    status?: StatusType | null | undefined
    children?: React.ReactNode
    className?: string
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
    showIcon?: boolean
}

const statusConfig: Record<string, { variant: StatusBadgeProps["variant"]; className: string; label?: string }> = {
    success: { variant: "default", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    completed: { variant: "default", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    active: { variant: "default", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    published: { variant: "default", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },

    error: { variant: "destructive", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    failed: { variant: "destructive", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    cancelled: { variant: "destructive", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    rejected: { variant: "destructive", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },

    warning: { variant: "default", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
    pending: { variant: "default", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
    draft: { variant: "default", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },

    info: { variant: "secondary", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
    processing: { variant: "secondary", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },

    inactive: { variant: "ghost", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
    archived: { variant: "ghost", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20" },
}

function normalizeStatus(status: StatusType | null | undefined): string {
    if (!status) return "unknown"
    return String(status).toLowerCase().trim()
}

export function StatusBadge({
    status,
    children,
    className,
    variant: overrideVariant,
    showIcon = false
}: StatusBadgeProps) {
    const normalizedStatus = normalizeStatus(status)
    const config = statusConfig[normalizedStatus] || {
        variant: "secondary",
        className: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    }

    const finalVariant = overrideVariant || config.variant
    const finalClassName = cn(
        "border px-2.5 py-0.5",
        config.className,
        className
    )

    const displayContent = children || status || normalizedStatus

    return (
        <Badge variant={finalVariant} className={finalClassName}>
            {displayContent}
        </Badge>
    )
}

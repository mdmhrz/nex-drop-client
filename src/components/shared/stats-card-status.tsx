import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "within" | "observe" | "exceed" | "unknown";

export interface StatsCardStatusProps {
    title: string;
    value: string | number;
    status: StatusType;
    range: string;
    icon?: React.ReactNode;
    className?: string;
}

const statusConfig = {
    within: {
        color: "bg-green-600/10 dark:bg-green-400/10 text-green-600 dark:text-green-400",
        icon: <TrendingUp className="size-3.5" />,
        label: "On Track",
    },
    observe: {
        color: "bg-amber-600/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400",
        icon: <Minus className="size-3.5" />,
        label: "Stable",
    },
    exceed: {
        color: "bg-destructive/10 text-destructive",
        icon: <TrendingDown className="size-3.5" />,
        label: "At Risk",
    },
    unknown: {
        color: "bg-sky-600/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400",
        icon: <ShieldAlert className="size-3.5" />,
        label: "Under Review",
    },
};

export function StatsCardStatus({ title, value, status, range, icon, className }: StatsCardStatusProps) {
    const config = statusConfig[status];

    return (
        <Card className={cn("flex flex-col gap-3", className)}>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-sm">{title}</CardTitle>
                {icon && (
                    <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md [&>svg]:size-4.5">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <p className="text-3xl font-semibold tracking-tight">{value}</p>
                <Badge className={cn(config.color, "gap-1.5")}>
                    {config.icon}
                    <span>{config.label}:</span>
                    <span>{range}</span>
                </Badge>
            </CardContent>
        </Card>
    );
}

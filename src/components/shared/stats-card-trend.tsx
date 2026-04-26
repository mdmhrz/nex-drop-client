import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatsCardTrendProps {
    title: string;
    value: string | number;
    trend: {
        value: string;
        direction: TrendDirection;
    };
    icon?: React.ReactNode;
    className?: string;
}

const trendConfig = {
    up: {
        icon: <TrendingUp className="size-4" />,
        className: "text-green-600 dark:text-green-500",
    },
    down: {
        icon: <TrendingDown className="size-4" />,
        className: "text-red-600 dark:text-red-500",
    },
    neutral: {
        icon: <Minus className="size-4" />,
        className: "text-muted-foreground",
    },
};

export function StatsCardTrend({ title, value, trend, icon, className }: StatsCardTrendProps) {
    const config = trendConfig[trend.direction];

    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className={cn("gap-1", config.className)}>
                        {config.icon}
                        <span>{trend.value}</span>
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

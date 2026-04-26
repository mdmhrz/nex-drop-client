"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface StatsCardChartProps {
    title: string;
    value: string | number;
    data: Array<Record<string, string | number>>;
    dataKey: string;
    color: string;
    change?: string;
    changeType?: "positive" | "negative";
    className?: string;
}

export function StatsCardChart({
    title,
    value,
    data,
    dataKey,
    color,
    change,
    changeType,
    className,
}: StatsCardChartProps) {
    const gradientId = `gradient-${dataKey}`;
    const chartConfig: ChartConfig = {
        [dataKey]: {
            label: dataKey,
            color: color,
        },
    };

    return (
        <Card className={cn("p-0", className)}>
            <CardContent className="p-4 pb-0">
                <div>
                    <dt className="text-sm font-medium text-foreground">{title}</dt>
                    <div className="flex items-baseline justify-between">
                        <dd
                            className={cn(
                                changeType === "positive"
                                    ? "text-green-600 dark:text-green-500"
                                    : changeType === "negative"
                                      ? "text-red-600 dark:text-red-500"
                                      : "text-foreground",
                                "text-lg font-semibold",
                            )}
                        >
                            {value}
                        </dd>
                        {change && (
                            <dd className="flex items-center space-x-1 text-sm">
                                <span className="font-medium text-foreground">{change}</span>
                            </dd>
                        )}
                    </div>
                </div>

                <div className="mt-2 h-16 overflow-hidden">
                    <ChartContainer className="w-full h-full" config={chartConfig}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide={true} />
                            <Area
                                dataKey={dataKey}
                                stroke={color}
                                fill={`url(#${gradientId})`}
                                fillOpacity={0.4}
                                strokeWidth={1.5}
                                type="monotone"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}

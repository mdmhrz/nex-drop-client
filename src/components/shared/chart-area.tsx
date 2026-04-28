"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartAreaProps {
    title?: string;
    description?: string;
    data: Array<Record<string, string | number>>;
    dataKey: string;
    xDataKey: string;
    config: ChartConfig;
    className?: string;
}

export function ChartArea({
    title,
    description,
    data,
    dataKey,
    xDataKey,
    config,
    className,
}: ChartAreaProps) {
    return (
        <Card className={cn("h-full", className)}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className="h-full">
                <ChartContainer config={config} className="w-full h-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}

                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xDataKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}

                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey={dataKey}
                            type="natural"
                            fill="var(--color-chart-2)"
                            fillOpacity={0.8}
                            stroke="var(--color-chart-1)"
                            className="mb-4"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

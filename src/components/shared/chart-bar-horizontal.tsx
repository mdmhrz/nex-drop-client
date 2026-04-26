"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartBarHorizontalProps {
    title?: string;
    description?: string;
    data: Array<Record<string, string | number>>;
    xDataKey: string;
    yDataKey: string;
    config: ChartConfig;
    className?: string;
}

export function ChartBarHorizontal({
    title,
    description,
    data,
    xDataKey,
    yDataKey,
    config,
    className,
}: ChartBarHorizontalProps) {
    return (
        <Card className={cn("", className)}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent>
                <ChartContainer config={config}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                    >
                        <XAxis type="number" dataKey={xDataKey} hide />
                        <YAxis
                            dataKey={yDataKey}
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey={xDataKey} fill="var(--color-chart-1)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

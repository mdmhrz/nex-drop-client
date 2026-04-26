"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartPieProps {
    title?: string;
    description?: string;
    data: Array<Record<string, string | number>>;
    dataKey: string;
    nameKey: string;
    config: ChartConfig;
    showLabel?: boolean;
    className?: string;
}

export function ChartPie({
    title,
    description,
    data,
    dataKey,
    nameKey,
    config,
    showLabel = false,
    className,
}: ChartPieProps) {
    return (
        <Card className={cn("flex flex-col", className)}>
            {title && (
                <CardHeader className={cn("items-center pb-0", !description && "pb-4")}>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className={cn("flex-1 pb-0", !title && "p-6")}>
                <ChartContainer
                    config={config}
                    className={cn("mx-auto aspect-square min-h-[300px] max-h-[400px] w-full px-0", !title && "min-h-[350px] max-h-[350px]")}
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey={dataKey} hideLabel />} />
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            labelLine={false}
                            label={
                                showLabel
                                    ? ({ payload, ...props }) => {
                                        return (
                                            <text
                                                cx={props.cx}
                                                cy={props.cy}
                                                x={props.x}
                                                y={props.y}
                                                textAnchor={props.textAnchor}
                                                dominantBaseline={props.dominantBaseline}
                                                fill="var(--foreground)"
                                            >
                                                {payload[dataKey]}
                                            </text>
                                        );
                                    }
                                    : undefined
                            }
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

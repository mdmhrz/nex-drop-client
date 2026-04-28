"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartBarVerticalProps {
  title?: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  xDataKey: string;
  yDataKey?: string;
  config: ChartConfig;
  className?: string;
}

export function ChartBarVertical({
  title,
  description,
  data,
  xDataKey,
  yDataKey,
  config,
  className,
}: ChartBarVerticalProps) {
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
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xDataKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {yDataKey && (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(config).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config[key].color || `var(--color-${key})`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

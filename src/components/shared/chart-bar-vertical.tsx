"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { cn } from "@/lib/utils";

export interface ChartBarVerticalProps {
  title?: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  xDataKey: string;
  dataKeys?: string[]; // Explicit data keys to render as bars
  config: ChartConfig;
  className?: string;
  showLegend?: boolean;
}

export function ChartBarVertical({
  title,
  description,
  data,
  xDataKey,
  dataKeys,
  config,
  className,
  showLegend = true,
}: ChartBarVerticalProps) {
  // Get data keys from config, excluding the xDataKey
  const barsToRender = dataKeys || Object.keys(config).filter(key => key !== xDataKey);

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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {showLegend && <Legend />}
            {barsToRender.map((key) => (
              <Bar
                key={key}
                stackId={undefined}
                dataKey={key}
                fill={config[key]?.color || `var(--color-${key})`}
                radius={[4, 4, 0, 0]}
                stroke="none"
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

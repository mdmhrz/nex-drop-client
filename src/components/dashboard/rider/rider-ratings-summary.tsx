"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRiderRatingSummary } from "@/hooks/use-ratings";
import { Star } from "lucide-react";

interface RiderRatingsSummaryProps {
    riderId: string;
}

const starLabels: { key: keyof import("@/hooks/use-ratings").RatingSummary["ratingDistribution"]; label: string; value: number }[] = [
    { key: "fiveStar", label: "5 stars", value: 5 },
    { key: "fourStar", label: "4 stars", value: 4 },
    { key: "threeStar", label: "3 stars", value: 3 },
    { key: "twoStar", label: "2 stars", value: 2 },
    { key: "oneStar", label: "1 star", value: 1 },
];

export function RiderRatingsSummary({ riderId }: RiderRatingsSummaryProps) {
    const { data, isLoading } = useRiderRatingSummary(riderId);

    if (isLoading || !data?.data) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    Loading summary...
                </CardContent>
            </Card>
        );
    }

    const { averageRating, totalRatings, ratingDistribution } = data.data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    Rating Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr]">
                {/* Big avg number */}
                <div className="flex flex-col items-center justify-center gap-1 pr-6 border-r">
                    <span className="text-5xl font-bold tracking-tight">
                        {averageRating.toFixed(1)}
                    </span>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`size-4 ${s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">{totalRatings} reviews</span>
                </div>

                {/* Distribution bars */}
                <div className="space-y-2">
                    {starLabels.map(({ key, label }) => {
                        const count = ratingDistribution[key];
                        const pct = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
                        return (
                            <div key={key} className="flex items-center gap-2 text-xs">
                                <span className="w-12 shrink-0 text-muted-foreground">{label}</span>
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-yellow-400 transition-all"
                                        data-pct={pct}
                                        ref={(el) => { if (el) el.style.width = `${pct}%`; }}
                                    />
                                </div>
                                <span className="w-6 text-right text-muted-foreground">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

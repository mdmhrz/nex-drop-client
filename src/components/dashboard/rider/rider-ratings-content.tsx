"use client";

import { useRiderProfile } from "@/hooks/use-rider-profile";
import { RiderRatingsSummary } from "./rider-ratings-summary";
import { RiderRatingsTable } from "./rider-ratings-table";

export function RiderRatingsContent() {
    const { data, isLoading } = useRiderProfile();

    if (isLoading || !data?.data) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="section-heading-text text-2xl font-bold tracking-tight">Ratings</h1>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const riderId = data.data.id;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Ratings</h1>
                <p className="text-muted-foreground">Your customer ratings and feedback.</p>
            </div>

            <RiderRatingsSummary riderId={riderId} />

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">All Reviews</h2>
                <RiderRatingsTable riderId={riderId} />
            </div>
        </div>
    );
}

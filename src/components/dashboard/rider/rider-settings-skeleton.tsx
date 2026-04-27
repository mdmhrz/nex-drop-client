import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function RiderSettingsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-5 w-96 mt-2" />
            </div>

            <Separator />

            {/* Availability Settings Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-4 w-80 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-72 mt-1" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                    </div>
                </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                    </div>
                </CardContent>
            </Card>

            {/* Account Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-5" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

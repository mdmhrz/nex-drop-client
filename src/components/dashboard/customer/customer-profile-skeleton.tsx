import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5" />
                            <Skeleton className="h-6 w-40" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-32 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-5 w-48 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-5 w-48 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-10" />
                            <Skeleton className="h-6 w-20 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-24 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-24 mt-1" />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-5" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-40 mt-1" />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-40 mt-1" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { getRiderProfile } from "@/services/rider.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Star, Package, MapPin, Calendar, Mail, User } from "lucide-react";

export default async function RiderProfilePage() {
    const response = await getRiderProfile();
    const profile = response.data;

    const accountStatusConfig: Record<string, "success" | "warning" | "destructive" | "info"> = {
        ACTIVE: "success",
        PENDING: "warning",
        SUSPENDED: "destructive",
        REJECTED: "destructive",
    };

    const currentStatusConfig: Record<string, "success" | "warning" | "destructive" | "info"> = {
        AVAILABLE: "success",
        BUSY: "warning",
        OFFLINE: "destructive",
        ON_DELIVERY: "info",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">View your rider profile information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{profile.user.name}</p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium flex items-center gap-2">
                                <Mail className="size-4 text-muted-foreground" />
                                {profile.user.email}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Role</p>
                            <Badge variant="outline">{profile.user.role}</Badge>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <StatusBadge status={accountStatusConfig[profile.accountStatus] || "info"}>
                                {profile.accountStatus}
                            </StatusBadge>
                        </div>
                    </CardContent>
                </Card>

                {/* Rider Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="size-5" />
                            Rider Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">District</p>
                            <p className="font-medium flex items-center gap-2">
                                <MapPin className="size-4 text-muted-foreground" />
                                {profile.district}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Current Status</p>
                            <StatusBadge status={currentStatusConfig[profile.currentStatus] || "info"}>
                                {profile.currentStatus.replace("_", " ")}
                            </StatusBadge>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <p className="font-medium flex items-center gap-2">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                {profile.rating.toFixed(1)} / 5.0
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Deliveries</p>
                            <p className="font-medium flex items-center gap-2">
                                <Package className="size-4 text-muted-foreground" />
                                {profile.totalDeliveries}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Member Since</p>
                                <p className="font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString("en-BD", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="font-medium">
                                    {new Date(profile.updatedAt).toLocaleDateString("en-BD", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

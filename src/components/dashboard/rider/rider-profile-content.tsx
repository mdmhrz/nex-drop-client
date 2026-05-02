"use client";

import { useRiderProfile } from "@/hooks/use-rider-profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { type User } from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiderStatusUpdate } from "@/components/dashboard/rider/rider-status-update";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputField } from "@/components/shared/input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Package, MapPin, Calendar, Mail, User as UserIcon, Edit, Phone } from "lucide-react";
import { RIDER_PROFILE_KEY } from "@/hooks/use-rider-profile";
import { SubmitButton } from "@/components/shared/submit-button";
import { Check } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const editProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name must be 255 characters or less"),
    phone: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export function RiderProfileContent() {
    const { data, isLoading } = useRiderProfile();
    const queryClient = useQueryClient();
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        mode: "onChange",
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: { name?: string; phone?: string }) =>
            api.patch<{ success: boolean; message: string; data: User }>("/users/me", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RIDER_PROFILE_KEY });
            setIsEditDialogOpen(false);
            reset();
        },
    });

    if (isLoading || !data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const profile = data?.data;

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
    };

    const handleEditClick = () => {
        reset({
            name: profile?.user?.name,
            phone: profile?.user?.phone || "",
        });
        setIsEditDialogOpen(true);
    };

    const onSubmit = (formData: EditProfileFormData) => {
        const updateData: { name?: string; phone?: string } = {
            name: formData.name,
        };
        if (formData.phone) updateData.phone = formData.phone;

        updateProfileMutation.mutate(updateData);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="section-heading-text text-2xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">View and manage your rider profile information.</p>
                </div>
                <div className="flex items-center gap-2">
                    <RiderStatusUpdate currentStatus={profile?.currentStatus} />
                    <Button onClick={handleEditClick} size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="size-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{profile?.user?.name}</p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium flex items-center gap-2">
                                <Mail className="size-4 text-muted-foreground" />
                                {profile?.user?.email}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium flex items-center gap-2">
                                <Phone className="size-4 text-muted-foreground" />
                                {profile?.user?.phone || "Not provided"}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Role</p>
                            <Badge variant="outline">{profile?.user?.role}</Badge>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <StatusBadge status={accountStatusConfig[profile?.accountStatus] || "info"}>
                                {profile?.accountStatus}
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
                                {profile?.district}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Current Status</p>
                            <StatusBadge status={currentStatusConfig[profile?.currentStatus] || "info"}>
                                {profile?.currentStatus?.replace("_", " ")}
                            </StatusBadge>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <p className="font-medium flex items-center gap-2">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                {profile?.rating?.toFixed(1)} / 5.0
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Deliveries</p>
                            <p className="font-medium flex items-center gap-2">
                                <Package className="size-4 text-muted-foreground" />
                                {profile?.totalDeliveries}
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
                                    {new Date(profile?.createdAt).toLocaleDateString("en-BD", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                <p className="font-medium">
                                    {new Date(profile?.updatedAt).toLocaleDateString("en-BD", {
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

            {/* Edit Profile Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <InputField
                                label="Name"
                                placeholder="Your name"
                                staticLabel
                                {...register("name")}
                                error={errors.name?.message}
                                required
                            />
                            <InputField
                                label="Phone"
                                placeholder="e.g., 01712345678"
                                staticLabel
                                {...register("phone")}
                                error={errors.phone?.message}
                            />
                        </div>
                        <DialogFooter className="flex items-center justify-center gap-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <SubmitButton
                                disabled={!isValid}
                                isPending={updateProfileMutation.isPending}
                                pendingLabel="Updating..."
                                icon={Check}
                                type="submit"
                                className="w-auto py-4"
                            >
                                Update Profile
                            </SubmitButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

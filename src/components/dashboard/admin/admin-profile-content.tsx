"use client";

import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import { type User } from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputField } from "@/components/shared/input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User as UserIcon, Mail, Calendar, Edit, Phone, Shield } from "lucide-react";
import { CUSTOMER_PROFILE_KEY } from "@/hooks/use-customer-profile";
import { SubmitButton } from "@/components/shared/submit-button";
import { Check } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be 255 characters or less"),
  phone: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export function AdminProfileContent() {
  const { data, isLoading } = useCustomerProfile();
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
      queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_KEY });
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

  const statusConfig: Record<string, "success" | "warning" | "destructive" | "info"> = {
    ACTIVE: "success",
    BLOCKED: "destructive",
    DELETED: "destructive",
    INACTIVE: "warning",
  };

  const roleColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CUSTOMER: "default",
    ADMIN: "secondary",
    RIDER: "outline",
    SUPER_ADMIN: "destructive",
  };

  const handleEditClick = () => {
    reset({
      name: profile.name,
      phone: profile.phone || "",
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
          <p className="text-muted-foreground">View and manage your profile information.</p>
        </div>
        <Button onClick={handleEditClick} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
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
              <p className="font-medium">{profile?.name}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                {profile?.email}
              </p>
            </div>
            {profile?.phone && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    {profile?.phone}
                  </p>
                </div>
              </>
            )}
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <Badge variant={roleColors[profile?.role] || "default"}>{profile?.role}</Badge>
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Status</p>
              <StatusBadge status={statusConfig[profile?.status] || "info"} variant="default">
                {profile?.status}
              </StatusBadge>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email Verified</p>
              <Badge variant={profile?.emailVerified ? "default" : "secondary"}>
                {profile?.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Separator />
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

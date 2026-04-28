"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
        confirmNewPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
    });

    const mutation = useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) => authService.changePassword(data),
        onSuccess: (response) => {
            toast.success(response.message || "Password changed successfully");
            reset();
            onOpenChange(false);
        },
        onError: (err: unknown) => {
            const errorMessage = (err as { message?: string })?.message || "Failed to change password";
            toast.error(errorMessage);
        },
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        mutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Update your account password. This action applies to all user roles.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <InputField
                            label="Current Password"
                            type="password"
                            placeholder="Enter current password"
                            showPasswordToggle
                            {...register("currentPassword")}
                            error={errors.currentPassword?.message}
                            beforeAppend={<Lock className="h-4 w-4" />}
                        />

                        <InputField
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            showPasswordToggle
                            {...register("newPassword")}
                            error={errors.newPassword?.message}
                            beforeAppend={<Lock className="h-4 w-4" />}
                        />

                        <InputField
                            label="Confirm New Password"
                            type="password"
                            placeholder="Retype new password"
                            showPasswordToggle
                            {...register("confirmNewPassword")}
                            error={errors.confirmNewPassword?.message}
                            beforeAppend={<Lock className="h-4 w-4" />}
                        />
                    </div>

                    <DialogFooter className="flex items-center justify-center gap-4">
                        <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
                            Cancel
                        </Button>
                        <SubmitButton
                            type="submit"
                            icon={Check}
                            isPending={mutation.isPending}
                            disabled={!isValid}
                            className="w-auto py-3"
                        >
                            Change Password
                        </SubmitButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ChangePasswordModal;

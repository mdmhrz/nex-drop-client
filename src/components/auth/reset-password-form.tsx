"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { KeyRound, Lock, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "Verification code must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await authService.resetPassword(data);

      if (response.success) {
        toast.success(response.message || "Password reset successfully!", { id: toastId });
        // Redirect to login after successful password reset
        router.push("/login");
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Password reset failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Email"
        type="email"
        placeholder="Enter your email address"
        {...register("email")}
        error={errors.email?.message}
        beforeAppend={<Mail className="h-4 w-4" />}
        disabled={!!emailFromUrl}
        defaultLabelUp={!!emailFromUrl}
      />

      <InputField
        label="Verification Code"
        type="text"
        placeholder="Enter the code sent to your email"
        {...register("otp")}
        error={errors.otp?.message}
        beforeAppend={<KeyRound className="h-4 w-4" />}
      />

      <InputField
        label="New Password"
        type="password"
        placeholder="Enter your new password"
        {...register("newPassword")}
        error={errors.newPassword?.message}
        beforeAppend={<Lock className="h-4 w-4" />}
        showPasswordToggle
      />

      <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid} isPending={isSubmitting}>
        Reset Password
      </SubmitButton>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const toastId = toast.loading("Sending reset link...");

    try {
      const response = await authService.forgetPassword(data.email);

      if (response.success) {
        toast.success(response.message || "Password reset link sent to your email!", { id: toastId });
        // Redirect to reset-password page with email in URL
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to send reset link. Please try again.";
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
      />

      <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid} isPending={isSubmitting}>
        Send Reset Link
      </SubmitButton>
    </form>
  );
}

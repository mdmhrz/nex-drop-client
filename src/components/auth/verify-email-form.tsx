"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitButton } from "@/components/shared/submit-button";
import { OtpInput } from "@/components/shared/otp-input";
import { ResendOtpButton } from "@/components/auth/resend-otp-button";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "Verification code must be 6 digits"),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: emailFromUrl,
      otp: "",
    },
  });

  const onSubmit = async () => {
    const toastId = toast.loading("Verifying email...");

    try {
      const response = await authService.verifyEmail({ email: emailFromUrl, otp: otp });

      if (response.success) {
        toast.success(response.message || "Email verified successfully!", { id: toastId });
        // Redirect to login after successful verification
        router.push("/login");
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Verification failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleResendOtp = async () => {
    if (!emailFromUrl) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResending(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await authService.resendOtp(emailFromUrl);

      if (response.success) {
        toast.success(response.message || "OTP sent successfully!", { id: toastId });
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setValue("otp", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Verification Code</label>
        <OtpInput value={otp} onChange={handleOtpChange} />
        {errors.otp?.message && (
          <p className="text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <SubmitButton disabled={otp.length !== 6} isPending={isSubmitting} className="flex-1">
          Verify Email
        </SubmitButton>
      </div>

      <div className="flex items-center justify-end">
        <ResendOtpButton onResend={handleResendOtp} isLoading={isResending} />
      </div>
    </form>
  );
}

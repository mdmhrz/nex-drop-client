"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { InputField } from "@/components/shared/input-field";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/shared/submit-button";
import { SocialLogin } from "@/components/auth/social-login";

import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authService, LoginData } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const email = watch("email");

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Signing in...");

    try {
      const response = await authService.login(data as LoginData);

      if (response.success) {
        toast.success(response.message || "Login successful!", { id: toastId });
        // Get user role from response and redirect accordingly
        const userRole = response.data?.user?.role;
        let redirectPath = "/dashboard"; // default

        if (userRole === "RIDER") {
          redirectPath = "/rider-dashboard";
        } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          redirectPath = "/admin-dashboard";
        }

        // Refresh page to pick up cookies set by backend, then redirect
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Login failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    const toastId = toast.loading("Resending verification email...");

    try {
      const response = await authService.resendOtp(email);

      if (response.success) {
        toast.success(response.message || "Verification email sent!", { id: toastId });
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Failed to resend verification email";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <SocialLogin />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          placeholder=" "
          {...register("email")}
          error={errors.email?.message}
          beforeAppend={<Mail className="h-4 w-4" />}
        />

        <InputField
          label="Password"
          type="password"
          placeholder=" "
          {...register("password")}
          error={errors.password?.message}
          beforeAppend={<Lock className="h-4 w-4" />}
          showPasswordToggle
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox {...register("rememberMe")} />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid} isPending={isSubmitting}>
          Sign in
        </SubmitButton>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={handleResendVerification}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Need to verify your email?
        </button>
      </div>


    </div>
  );
}

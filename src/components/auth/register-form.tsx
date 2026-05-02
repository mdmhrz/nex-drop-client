"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { SocialLogin } from "@/components/auth/social-login";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authService, RegisterData } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const toastId = toast.loading("Creating account...");

    try {
      const response = await authService.register(data as RegisterData);

      if (response.success) {
        toast.success(response.message || "Registration successful!", { id: toastId });
        // Redirect to verify-email page with email in URL
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || "Registration failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <SocialLogin />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Name"
          type="text"
          placeholder=" "
          {...register("name")}
          error={errors.name?.message}
          beforeAppend={<User className="h-4 w-4" />}
        />

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

        <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid} isPending={isSubmitting}>
          Create account
        </SubmitButton>
      </form>
    </div>
  );
}

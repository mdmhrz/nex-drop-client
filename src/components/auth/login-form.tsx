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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: Implement login logic
    console.log(data);
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

        <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid}>
          Sign in
        </SubmitButton>
      </form>
    </div>
  );
}

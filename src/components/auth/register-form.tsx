"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { SocialLogin } from "@/components/auth/social-login";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    // TODO: Implement registration logic
    console.log(data);
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

        <SubmitButton icon={ArrowRight} iconPosition="right" disabled={!isValid}>
          Create account
        </SubmitButton>
      </form>
    </div>
  );
}

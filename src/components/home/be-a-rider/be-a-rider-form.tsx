"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { allDistricts } from "@bangladeshi/bangladesh-address/build/src";
import { InputField } from "@/components/shared/input-field";
import { DistrictCombobox } from "@/components/shared/district-combobox";
import { SubmitButton } from "@/components/shared/submit-button";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { riderService } from "@/services/rider.service";
import { useRouter } from "next/navigation";

// ─── Animation helpers ───────────────────────────────────────────────────────

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const allDistrictList = allDistricts();

// ─── Schemas ────────────────────────────────────────────────────────────────

const authSchema = z.object({
    district: z
        .string()
        .min(1, "District is required")
        .max(255, "District must be less than 255 characters"),
});

const unauthSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(255, "Name must be less than 255 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(1, "Phone number is required"),
    district: z
        .string()
        .min(1, "District is required")
        .max(255, "District must be less than 255 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;
type UnauthFormData = z.infer<typeof unauthSchema>;

// ─── Authenticated Form ──────────────────────────────────────────────────────

function AuthenticatedRiderForm() {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        mode: "onChange",
        defaultValues: { district: "" },
    });

    const onSubmit = async (data: AuthFormData) => {
        const toastId = toast.loading("Submitting your application...");
        try {
            const response = await riderService.applyAsRider(data);
            if (response.success) {
                toast.success(
                    response.message || "Application submitted! Your profile is under review.",
                    { id: toastId }
                );
                setTimeout(() => { window.location.href = "/rider-dashboard"; }, 1500);
            }
        } catch (error: unknown) {
            toast.error(
                (error as { message?: string })?.message || "Submission failed. Please try again.",
                { id: toastId }
            );
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            <motion.div variants={item}>
                <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-1.5">
                            <Label className={cn("text-sm font-medium", errors.district && "text-destructive")}>
                                District <span className="text-destructive">*</span>
                            </Label>
                            <DistrictCombobox
                                value={field.value}
                                onChange={field.onChange}
                                districts={allDistrictList}
                                error={!!errors.district}
                                placeholder="Select your district"
                            />
                            {errors.district && (
                                <p className="text-xs text-destructive">{errors.district.message}</p>
                            )}
                        </div>
                    )}
                />
            </motion.div>

            <motion.div variants={item}>
                <SubmitButton
                    icon={ArrowRight}
                    iconPosition="right"
                    disabled={!isValid}
                    isPending={isSubmitting}
                    pendingLabel="Submitting..."
                >
                    Submit Application
                </SubmitButton>
            </motion.div>
        </motion.form>
    );
}

// ─── Unauthenticated Form ────────────────────────────────────────────────────

function UnauthenticatedRiderForm() {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<UnauthFormData>({
        resolver: zodResolver(unauthSchema),
        mode: "onChange",
        defaultValues: { name: "", email: "", password: "", phone: "", district: "" },
    });

    const onSubmit = async (data: UnauthFormData) => {
        const toastId = toast.loading("Creating your account...");
        try {
            const response = await riderService.applyAsRiderUnauth(data);
            if (response.success) {
                toast.success(
                    response.message || "Account created! Please verify your email to continue.",
                    { id: toastId }
                );
                router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
            }
        } catch (error: unknown) {
            toast.error(
                (error as { message?: string })?.message || "Submission failed. Please try again.",
                { id: toastId }
            );
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
        >
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={item}>
                    <InputField
                        staticLabel
                        label="Full Name"
                        type="text"
                        placeholder=" "
                        {...register("name")}
                        error={errors.name?.message}
                        beforeAppend={<User className="h-4 w-4" />}
                        className="py-6"
                    />
                </motion.div>
                <motion.div variants={item}>
                    <InputField
                        staticLabel
                        label="Phone Number"
                        type="tel"
                        placeholder=" "
                        {...register("phone")}
                        error={errors.phone?.message}
                        beforeAppend={<Phone className="h-4 w-4" />}
                        className="py-6"
                    />
                </motion.div>
            </div>

            {/* Row 2: Email + District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={item}>
                    <InputField
                        staticLabel
                        label="Email"
                        type="email"
                        placeholder=" "
                        {...register("email")}
                        error={errors.email?.message}
                        beforeAppend={<Mail className="h-4 w-4" />}
                        className="py-6"

                    />
                </motion.div>
                <motion.div variants={item}>
                    <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-1.5">
                                <Label className={cn("text-sm font-medium", errors.district && "text-destructive")}>
                                    District <span className="text-destructive">*</span>
                                </Label>
                                <DistrictCombobox
                                    value={field.value}
                                    onChange={field.onChange}
                                    districts={allDistrictList}
                                    error={!!errors.district}
                                    placeholder="Select your district"
                                    className="py-6"
                                />
                                {errors.district && (
                                    <p className="text-xs text-destructive">{errors.district.message}</p>
                                )}
                            </div>
                        )}
                    />
                </motion.div>
            </div>

            {/* Row 3: Password full width */}
            <motion.div variants={item}>
                <InputField
                    staticLabel
                    label="Password"
                    type="password"
                    placeholder=" "
                    {...register("password")}
                    error={errors.password?.message}
                    beforeAppend={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    className="py-6"
                />
            </motion.div>

            <motion.div variants={item}>
                <SubmitButton
                    icon={ArrowRight}
                    iconPosition="right"
                    disabled={!isValid}
                    isPending={isSubmitting}
                    pendingLabel="Submitting..."
                >
                    Apply as Rider — It&apos;s Free
                </SubmitButton>
            </motion.div>
        </motion.form>
    );
}

// ─── Exported Component ──────────────────────────────────────────────────────

interface BeARiderFormProps {
    isAuthenticated: boolean;
}

export function BeARiderForm({ isAuthenticated }: BeARiderFormProps) {
    return isAuthenticated ? <AuthenticatedRiderForm /> : <UnauthenticatedRiderForm />;
}

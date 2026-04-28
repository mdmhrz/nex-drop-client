"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import {
    allDistricts,
    upazilaNamesOf,
    thanaNamesOf,
} from "@bangladeshi/bangladesh-address/build/src";
import {
    MapPin,
    Home,
    Weight,
    FileText,
    ArrowRight,
    Package,
    Zap,
    Info,
} from "lucide-react";
import { InputField } from "@/components/shared/input-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { DistrictCombobox } from "@/components/shared/district-combobox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCreateParcel } from "@/hooks/use-create-parcel";
import { cn } from "@/lib/utils";
import { ParcelType, ServiceType } from "@/services/parcel.service";

// ─── Pricing ─────────────────────────────────────────────────────────────────

const BASE_RATES: Record<ServiceType, { sameDistrict: number; interDistrict: number }> = {
    STANDARD: { sameDistrict: 60, interDistrict: 120 },
    EXPRESS: { sameDistrict: 110, interDistrict: 200 },
};

const TYPE_SURCHARGES: Record<ParcelType, number> = {
    DOCUMENT: 0, SMALL: 0, MEDIUM: 20, LARGE: 50, FRAGILE: 50, ELECTRONICS: 70,
};

function calcPrice(
    weight: number,
    parcelType: ParcelType,
    serviceType: ServiceType,
    districtFrom: string,
    districtTo: string
) {
    const isSame = !!districtFrom && !!districtTo &&
        districtFrom.trim().toLowerCase() === districtTo.trim().toLowerCase();
    const base = isSame ? BASE_RATES[serviceType].sameDistrict : BASE_RATES[serviceType].interDistrict;
    const typeSurcharge = TYPE_SURCHARGES[parcelType];
    const weightSurcharge = Math.ceil(Math.max(0, weight - 1)) * 15;
    return { price: base + typeSurcharge + weightSurcharge, base, typeSurcharge, weightSurcharge };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARCEL_TYPES: [ParcelType, ...ParcelType[]] = ["DOCUMENT", "SMALL", "MEDIUM", "LARGE", "FRAGILE", "ELECTRONICS"];
const SERVICE_TYPES: [ServiceType, ...ServiceType[]] = ["STANDARD", "EXPRESS"];
const PARCEL_TYPE_LABELS: Record<ParcelType, string> = {
    DOCUMENT: "Document", SMALL: "Small Package", MEDIUM: "Medium Package",
    LARGE: "Large Package", FRAGILE: "Fragile Item", ELECTRONICS: "Electronics",
};
const allDistrictList = allDistricts();

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const createParcelSchema = z.object({
    pickupAddressText: z.string().max(300, "Max 300 characters").optional(),
    pickupDistrict: z.string().min(1, "Pickup district is required"),
    pickupUpazila: z.string().min(1, "Pickup upazila is required"),
    pickupThana: z.string().optional(),
    deliveryAddressText: z.string().max(300, "Max 300 characters").optional(),
    deliveryDistrict: z.string().min(1, "Delivery district is required"),
    deliveryUpazila: z.string().min(1, "Delivery upazila is required"),
    deliveryThana: z.string().optional(),
    weight: z.coerce
        .number({ invalid_type_error: "Weight must be a number" })
        .positive("Weight must be greater than 0")
        .max(50, "Maximum weight is 50 kg"),
    parcelType: z.enum(PARCEL_TYPES, { message: "Select a parcel type" }),
    serviceType: z.enum(SERVICE_TYPES, { message: "Select a service type" }),
    note: z.string().max(1000, "Note must be 1000 characters or less").optional(),
});

type FormData = z.infer<typeof createParcelSchema>;

// ─── Address Section ──────────────────────────────────────────────────────────

type AddressPrefix = "pickup" | "delivery";

interface AddressSectionProps {
    prefix: AddressPrefix;
    register: ReturnType<typeof useForm<FormData>>["register"];
    watch: ReturnType<typeof useForm<FormData>>["watch"];
    setValue: ReturnType<typeof useForm<FormData>>["setValue"];
    errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
}

function AddressSection({ prefix, register, watch, setValue, errors }: AddressSectionProps) {
    const districtKey = `${prefix}District` as const;
    const upazilaKey = `${prefix}Upazila` as const;
    const thanaKey = `${prefix}Thana` as const;
    const addressTextKey = `${prefix}AddressText` as const;

    const selectedDistrict = watch(districtKey);
    const selectedUpazila = watch(upazilaKey);

    const upazilas = React.useMemo(
        () => (selectedDistrict ? upazilaNamesOf(selectedDistrict) : []),
        [selectedDistrict]
    );
    const thanas = React.useMemo(
        () => (selectedDistrict ? thanaNamesOf(selectedDistrict) : []),
        [selectedDistrict]
    );

    return (
        <div className="space-y-4">
            <InputField
                label="Street / House / Flat (optional)"
                placeholder="e.g. House 12, Road 5"
                staticLabel
                beforeAppend={<Home className="h-4 w-4" />}
                {...register(addressTextKey)}
                error={errors[addressTextKey]?.message}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label className={cn(errors[districtKey] && "text-destructive")}>
                        District <span className="text-destructive">*</span>
                    </Label>
                    <DistrictCombobox
                        value={watch(districtKey)}
                        onChange={(val) => {
                            setValue(districtKey, val, { shouldValidate: true });
                            setValue(upazilaKey, "", { shouldValidate: false });
                            setValue(thanaKey, "", { shouldValidate: false });
                        }}
                        districts={allDistrictList}
                        error={!!errors[districtKey]}
                        placeholder="Search district..."
                    />
                    {errors[districtKey] && (
                        <p className="text-xs text-destructive">{errors[districtKey]?.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label className={cn(errors[upazilaKey] && "text-destructive")}>
                        Upazila <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={selectedUpazila ?? ""}
                        onValueChange={(val) => setValue(upazilaKey, val, { shouldValidate: true })}
                        disabled={!selectedDistrict}
                    >
                        <SelectTrigger className={cn(errors[upazilaKey] && "border-destructive")}>
                            <SelectValue
                                placeholder={selectedDistrict ? "Select upazila" : "Select district first"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {upazilas.map((u) => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors[upazilaKey] && (
                        <p className="text-xs text-destructive">{errors[upazilaKey]?.message}</p>
                    )}
                </div>
            </div>

            {thanas.length > 0 && (
                <div className="space-y-1.5">
                    <Label>
                        Thana{" "}
                        <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Select
                        value={watch(thanaKey) ?? ""}
                        onValueChange={(val) => setValue(thanaKey, val, { shouldValidate: true })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select thana (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            {thanas.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}

// ─── Price Preview ────────────────────────────────────────────────────────────

interface PricePreviewProps {
    weight: number;
    parcelType: ParcelType | "";
    serviceType: ServiceType;
    districtFrom: string;
    districtTo: string;
}

function PricePreview({ weight, parcelType, serviceType, districtFrom, districtTo }: PricePreviewProps) {
    if (!parcelType || !weight || weight <= 0) return null;
    const { price, base, typeSurcharge, weightSurcharge } = calcPrice(
        weight, parcelType as ParcelType, serviceType, districtFrom, districtTo
    );
    const isSame = !!districtFrom && !!districtTo &&
        districtFrom.trim().toLowerCase() === districtTo.trim().toLowerCase();
    const routeLabel = districtFrom && districtTo ? (isSame ? "Same district" : "Inter-district") : "—";

    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-primary" />
                    Estimated Price
                </span>
                <span className="text-xl font-bold text-primary">৳{price}</span>
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Base ({serviceType === "EXPRESS" ? "Express" : "Standard"} · {routeLabel})</span>
                    <span className="text-foreground font-medium">৳{base}</span>
                </div>
                {typeSurcharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Parcel type surcharge</span>
                        <span className="text-foreground font-medium">+৳{typeSurcharge}</span>
                    </div>
                )}
                {weightSurcharge > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Weight ({Math.ceil(Math.max(0, weight - 1))} extra kg × ৳15)</span>
                        <span className="text-foreground font-medium">+৳{weightSurcharge}</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground italic">* Final price is calculated server-side.</p>
        </Card>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function CreateParcelForm() {
    const { mutate: createParcel, isPending } = useCreateParcel();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(createParcelSchema),
        mode: "onChange",
        defaultValues: {
            pickupAddressText: "",
            pickupDistrict: "",
            pickupUpazila: "",
            pickupThana: "",
            deliveryAddressText: "",
            deliveryDistrict: "",
            deliveryUpazila: "",
            deliveryThana: "",
            weight: undefined,
            parcelType: undefined,
            serviceType: "STANDARD",
            note: "",
        },
    });

    const [weight, parcelType, serviceType, pickupDistrict, deliveryDistrict] = watch([
        "weight", "parcelType", "serviceType", "pickupDistrict", "deliveryDistrict",
    ]);

    const buildAddress = (text: string, thana: string, upazila: string, district: string) =>
        [text, thana, upazila, district].filter(Boolean).join(", ");

    const onSubmit = (data: FormData) => {
        createParcel({
            pickupAddress: buildAddress(
                data.pickupAddressText ?? "", data.pickupThana ?? "", data.pickupUpazila, data.pickupDistrict
            ),
            deliveryAddress: buildAddress(
                data.deliveryAddressText ?? "", data.deliveryThana ?? "", data.deliveryUpazila, data.deliveryDistrict
            ),
            districtFrom: data.pickupDistrict,
            districtTo: data.deliveryDistrict,
            weight: data.weight,
            parcelType: data.parcelType,
            serviceType: data.serviceType,
            note: data.note || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Service Type */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-primary" />
                        Service Type
                    </CardTitle>
                    <CardDescription>
                        Choose delivery speed. Price is calculated based on your selection.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {SERVICE_TYPES.map((type) => {
                            const isActive = watch("serviceType") === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue("serviceType", type, { shouldValidate: true })}
                                    className={cn(
                                        "rounded-lg border-2 p-4 text-left transition-all",
                                        isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold">
                                            {type === "STANDARD" ? "Standard" : "Express"}
                                        </span>
                                        <Badge variant={isActive ? "default" : "outline"} className="text-xs shrink-0">
                                            {type === "STANDARD" ? "2–5 days" : "1–2 days"}
                                        </Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {type === "STANDARD"
                                            ? "Same district ৳60 · Inter-district ৳120"
                                            : "Same district ৳110 · Inter-district ৳200"}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Pickup and Delivery Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MapPin className="h-4 w-4 text-primary" />
                            Pickup Address
                        </CardTitle>
                        <CardDescription>Where should the parcel be collected from?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AddressSection prefix="pickup" register={register} watch={watch} setValue={setValue} errors={errors} />
                    </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MapPin className="h-4 w-4 text-green-500" />
                            Delivery Address
                        </CardTitle>
                        <CardDescription>Where should the parcel be delivered to?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AddressSection prefix="delivery" register={register} watch={watch} setValue={setValue} errors={errors} />
                    </CardContent>
                </Card>
            </div>


            {/* Parcel Details and Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parcel Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Package className="h-4 w-4 text-primary" />
                            Parcel Details
                        </CardTitle>
                        <CardDescription>Describe your parcel so we can handle it correctly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label="Weight (kg)"
                                type="number"
                                placeholder="e.g. 1.5"
                                staticLabel
                                beforeAppend={<Weight className="h-4 w-4" />}
                                {...register("weight")}
                                error={errors.weight?.message}
                                min={0.1}
                                max={50}
                                step={0.1}
                            />
                            <div className="space-y-1.5">
                                <Label className={cn(errors.parcelType && "text-destructive")}>
                                    Parcel Type <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={watch("parcelType") ?? ""}
                                    onValueChange={(val) =>
                                        setValue("parcelType", val as ParcelType, { shouldValidate: true })
                                    }
                                >
                                    <SelectTrigger className={cn(errors.parcelType && "border-destructive")}>
                                        <SelectValue placeholder="Select parcel type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PARCEL_TYPES.map((pt) => (
                                            <SelectItem key={pt} value={pt}>
                                                <span className="flex items-center justify-between gap-6 w-full">
                                                    <span>{PARCEL_TYPE_LABELS[pt]}</span>
                                                    {TYPE_SURCHARGES[pt] > 0 && (
                                                        <span className="text-muted-foreground text-xs">
                                                            +৳{TYPE_SURCHARGES[pt]}
                                                        </span>
                                                    )}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.parcelType && (
                                    <p className="text-xs text-destructive">{errors.parcelType.message}</p>
                                )}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Note */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4 text-primary" />
                            Additional Note
                            <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="e.g. Please call before delivery, leave at the gate..."
                            className={cn("resize-none min-h-20", errors.note && "border-destructive")}
                            {...register("note")}
                        />
                        {errors.note && (
                            <p className="mt-1 text-xs text-destructive">{errors.note.message}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <PricePreview
                weight={Number(weight) || 0}
                parcelType={(parcelType as ParcelType) ?? ""}
                serviceType={(serviceType as ServiceType) ?? "STANDARD"}
                districtFrom={pickupDistrict ?? ""}
                districtTo={deliveryDistrict ?? ""}
            />

            {/* Submit */}
            <div className="flex justify-start">
                <SubmitButton
                    icon={ArrowRight}
                    iconPosition="right"
                    disabled={!isValid}
                    isPending={isPending}
                    pendingLabel="Creating parcel..."
                    className="w-full sm:w-auto sm:min-w-48"
                >
                    Create Parcel
                </SubmitButton>
            </div>
        </form>
    );
}

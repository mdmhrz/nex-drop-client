"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddressMutations, type Address, type CreateAddressInput, type UpdateAddressInput } from "@/hooks/use-addresses";
import { SubmitButton } from "@/components/shared/submit-button";
import { InputField } from "@/components/shared/input-field";
import { BangladeshAddressSelector } from "@/components/shared/bangladesh-address-selector";
import { Check, Tag, Phone } from "lucide-react";

const addressSchema = z
  .object({
    label: z.string().min(1, "Label is required").max(255, "Label must be 255 characters or less"),
    addressText: z.string().max(300, "Max 300 characters").optional(),
    district: z.string().min(1, "District is required").max(255, "District must be 255 characters or less"),
    upazila: z.string().max(255, "Upazila must be 255 characters or less").optional(),
    thana: z.string().max(255, "Thana must be 255 characters or less").optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.upazila && !data.thana) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select an upazila or thana",
        path: ["upazila"],
      });
    }
  });

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormModalProps {
  address: Address | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressFormModal({ address, open, onOpenChange }: AddressFormModalProps) {
  const { createAddress, updateAddress, isCreating, isUpdating } = useAddressMutations();
  const isEdit = !!address;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onChange",
    defaultValues: address
      ? {
        label: address.label,
        addressText: address.address,
        district: address.district,
        upazila: address.upazila,
        thana: address.thana || "",
        phone: address.phone || "",
        isDefault: address.isDefault,
      }
      : {
        label: "",
        addressText: "",
        district: "",
        upazila: "",
        thana: "",
        phone: "",
        isDefault: false,
      },
  });

  const buildAddress = (text: string, upazila?: string, district?: string, thana?: string) =>
    [text, thana, upazila, district].filter(Boolean).join(", ");

  const onSubmit = (data: AddressFormData) => {
    const submitData = {
      ...data,
      address: buildAddress(data.addressText || "", data.upazila, data.district, data.thana),
    } as CreateAddressInput;

    if (isEdit && address) {
      updateAddress({
        id: address.id,
        input: submitData as UpdateAddressInput,
      });
    } else {
      createAddress(submitData);
    }
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your address details below."
              : "Fill in the details to add a new address to your account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <InputField
              label="Label"
              placeholder="e.g., Home, Office"
              staticLabel
              {...register("label")}
              error={errors.label?.message}
              required
            />

            <BangladeshAddressSelector
              addressTextValue={watch("addressText")}
              onAddressTextChange={(val) => setValue("addressText", val)}
              addressTextError={errors.addressText?.message}
              districtValue={watch("district")}
              onDistrictChange={(val) => setValue("district", val, { shouldValidate: true })}
              districtError={errors.district?.message}
              upazilaValue={watch("upazila")}
              onUpazilaChange={(val) => setValue("upazila", val, { shouldValidate: true })}
              upazilaError={errors.upazila?.message}
              thanaValue={watch("thana")}
              onThanaChange={(val) => setValue("thana", val)}
              thanaError={errors.thana?.message}
            />

            <InputField
              label="Phone"
              placeholder="e.g., 01712345678"
              staticLabel
              {...register("phone")}
              error={errors.phone?.message}
            />

          </div>
          <DialogFooter className="flex items-center justify-center gap-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton
              // disabled={!isValid}
              isPending={isCreating || isUpdating}
              pendingLabel={isEdit ? "Updating..." : "Creating..."}
              icon={Check}
              type="submit"
              className="w-auto py-4"
            >
              {isEdit ? "Update Address" : "Add Address"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

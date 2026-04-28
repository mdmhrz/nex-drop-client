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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAddressMutations, type Address, type CreateAddressInput, type UpdateAddressInput } from "@/hooks/use-addresses";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/shared/submit-button";
import { Check } from "lucide-react";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required").max(255, "Label must be 255 characters or less"),
  address: z.string().min(1, "Address is required").max(500, "Address must be 500 characters or less"),
  district: z.string().min(1, "District is required").max(255, "District must be 255 characters or less"),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
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
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          label: address.label,
          address: address.address,
          district: address.district,
          phone: address.phone || "",
          isDefault: address.isDefault,
        }
      : {
          label: "",
          address: "",
          district: "",
          phone: "",
          isDefault: false,
        },
  });

  const onSubmit = (data: AddressFormData) => {
    if (isEdit && address) {
      updateAddress({
        id: address.id,
        input: data as UpdateAddressInput,
      });
    } else {
      createAddress(data as CreateAddressInput);
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
            <div className="grid gap-2">
              <Label htmlFor="label">
                Label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="label"
                placeholder="e.g., Home, Office"
                {...register("label")}
                className={cn(errors.label && "border-destructive")}
              />
              {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="e.g., House 12, Road 5, Dhanmondi"
                {...register("address")}
                className={cn(errors.address && "border-destructive")}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="district">
                District <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                placeholder="e.g., Dhaka"
                {...register("district")}
                className={cn(errors.district && "border-destructive")}
              />
              {errors.district && <p className="text-sm text-destructive">{errors.district.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="e.g., 01712345678"
                {...register("phone")}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isDefault" {...register("isDefault")} />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton
              isPending={isCreating || isUpdating}
              pendingLabel={isEdit ? "Updating..." : "Creating..."}
              icon={Check}
              type="submit"
            >
              {isEdit ? "Update Address" : "Add Address"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { allDistricts, upazilaNamesOf, thanaNamesOf } from "@bangladeshi/bangladesh-address/build/src";
import { InputField } from "@/components/shared/input-field";
import { DistrictCombobox } from "@/components/shared/district-combobox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const allDistrictList = allDistricts();

export interface BangladeshAddressSelectorProps {
  // Address text (street/house/flat)
  addressTextValue?: string;
  onAddressTextChange?: (value: string) => void;
  addressTextError?: string;
  addressTextPlaceholder?: string;
  addressTextLabel?: string;
  addressTextRequired?: boolean;

  // District
  districtValue?: string;
  onDistrictChange: (value: string) => void;
  districtError?: string;
  districtPlaceholder?: string;
  districtLabel?: string;
  districtRequired?: boolean;

  // Upazila/Thana
  upazilaValue?: string;
  onUpazilaChange: (value: string) => void;
  upazilaError?: string;
  upazilaPlaceholder?: string;
  upazilaLabel?: string;
  upazilaRequired?: boolean;

  thanaValue?: string;
  onThanaChange: (value: string) => void;
  thanaError?: string;
  thanaPlaceholder?: string;
  thanaLabel?: string;
  thanaRequired?: boolean;

  // Layout
  className?: string;
}

export function BangladeshAddressSelector({
  addressTextValue = "",
  onAddressTextChange,
  addressTextError,
  addressTextPlaceholder = "e.g. House 12, Road 5",
  addressTextLabel = "Street / House / Flat",
  addressTextRequired = false,
  districtValue = "",
  onDistrictChange,
  districtError,
  districtPlaceholder = "Search district...",
  districtLabel = "District",
  districtRequired = true,
  upazilaValue = "",
  onUpazilaChange,
  upazilaError,
  upazilaPlaceholder = "Select upazila",
  upazilaLabel = "Upazila",
  upazilaRequired = true,
  thanaValue = "",
  onThanaChange,
  thanaError,
  thanaPlaceholder = "Select thana",
  thanaLabel = "Thana",
  thanaRequired = true,
  className,
}: BangladeshAddressSelectorProps) {
  const upazilas = React.useMemo(
    () => (districtValue ? upazilaNamesOf(districtValue) : []),
    [districtValue]
  );

  const thanas = React.useMemo(
    () => (districtValue ? thanaNamesOf(districtValue) : []),
    [districtValue]
  );

  const hasThana = thanas.length > 0;

  const handleDistrictChange = (value: string) => {
    onDistrictChange(value);
    // Reset upazila and thana when district changes
    onUpazilaChange("");
    onThanaChange("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Address Text */}
      <InputField
        label={addressTextLabel}
        placeholder={addressTextPlaceholder}
        staticLabel
        defaultValue={addressTextValue}
        onChange={(e) => onAddressTextChange?.(e.target.value)}
        error={addressTextError}
        required={addressTextRequired}
      />

      {/* District and Upazila */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* District */}
        <div className="space-y-1.5">
          <Label className={cn("text-sm font-medium", districtError && "text-destructive")}>
            {districtLabel} {districtRequired && <span className="text-destructive">*</span>}
          </Label>
          <DistrictCombobox
            value={districtValue}
            onChange={handleDistrictChange}
            districts={allDistrictList}
            error={!!districtError}
            placeholder={districtPlaceholder}
          />
          {districtError && <p className="text-xs text-destructive">{districtError}</p>}
        </div>

        {/* Upazila or Thana */}
        <div className="space-y-1.5">
          <Label className={cn("text-sm font-medium", (hasThana ? thanaError : upazilaError) && "text-destructive")}>
            {hasThana ? thanaLabel : upazilaLabel} {(hasThana ? thanaRequired : upazilaRequired) && <span className="text-destructive">*</span>}
          </Label>
          <Select
            value={hasThana ? (thanaValue ?? "") : (upazilaValue ?? "")}
            onValueChange={hasThana ? onThanaChange : onUpazilaChange}
            disabled={!districtValue}
          >
            <SelectTrigger className={cn("w-full", (hasThana ? thanaError : upazilaError) && "border-destructive")}>
              <SelectValue
                placeholder={districtValue ? (hasThana ? thanaPlaceholder : upazilaPlaceholder) : "Select district first"}
              />
            </SelectTrigger>
            <SelectContent>
              {hasThana ? (
                thanas.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))
              ) : (
                upazilas.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {hasThana ? (thanaError && <p className="text-xs text-destructive">{thanaError}</p>) : (upazilaError && <p className="text-xs text-destructive">{upazilaError}</p>)}
        </div>
      </div>
    </div>
  );
}

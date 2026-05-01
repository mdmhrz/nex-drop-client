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

  const hasUpazila = upazilas.length > 0;
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

      {/* District + Upazila + Thana */}
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

        {/* Upazila — shown when upazilas exist */}
        {hasUpazila && (
          <div className="space-y-1.5">
            <Label className={cn("text-sm font-medium", upazilaError && "text-destructive")}>
              {upazilaLabel} {!hasThana && upazilaRequired && <span className="text-destructive">*</span>}
              {hasThana && <span className="text-xs font-normal text-muted-foreground ml-1">(rural areas)</span>}
            </Label>
            <Select
              value={upazilaValue ?? ""}
              onValueChange={onUpazilaChange}
              disabled={!districtValue}
            >
              <SelectTrigger className={cn("w-full", upazilaError && "border-destructive")}>
                <SelectValue placeholder={districtValue ? upazilaPlaceholder : "Select district first"} />
              </SelectTrigger>
              <SelectContent>
                {upazilas.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {upazilaError && <p className="text-xs text-destructive">{upazilaError}</p>}
          </div>
        )}

        {/* Thana — shown when thanas exist */}
        {hasThana && (
          <div className="space-y-1.5">
            <Label className={cn("text-sm font-medium", thanaError && "text-destructive")}>
              {thanaLabel} {!hasUpazila && thanaRequired && <span className="text-destructive">*</span>}
              {hasUpazila && <span className="text-xs font-normal text-muted-foreground ml-1">(city areas)</span>}
            </Label>
            <Select
              value={thanaValue ?? ""}
              onValueChange={onThanaChange}
              disabled={!districtValue}
            >
              <SelectTrigger className={cn("w-full", thanaError && "border-destructive")}>
                <SelectValue placeholder={districtValue ? thanaPlaceholder : "Select district first"} />
              </SelectTrigger>
              <SelectContent>
                {thanas.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {thanaError && <p className="text-xs text-destructive">{thanaError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

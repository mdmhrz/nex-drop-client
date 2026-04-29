"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
}

const sizeClass = {
    sm: "size-5",
    md: "size-7",
    lg: "size-9",
};

export function StarRatingInput({ value, onChange, disabled, size = "md" }: StarRatingInputProps) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="flex gap-1" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star !== 1 ? "s" : ""}${value === star ? ", selected" : ""}`}
                    disabled={disabled}
                    className={cn(
                        "transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
                        !disabled && "hover:scale-110 cursor-pointer",
                        disabled && "cursor-not-allowed opacity-60"
                    )}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => !disabled && setHovered(star)}
                    onMouseLeave={() => !disabled && setHovered(0)}
                >
                    <Star
                        className={cn(
                            sizeClass[size],
                            "transition-colors",
                            star <= active
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground/40"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

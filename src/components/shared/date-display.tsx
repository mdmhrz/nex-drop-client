import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DisplayMode = "datetime" | "date" | "time" | "day" | "relative" | "custom";

export interface DateDisplayProps {
    /** ISO string, Date object, or timestamp number */
    value: string | Date | number;
    /**
     * Display mode:
     * - "datetime" → Apr 26, 2026, 1:16 AM  (default)
     * - "date"     → Apr 26, 2026
     * - "time"     → 1:16 AM
     * - "day"      → Sunday
     * - "relative" → 2 days ago / just now
     * - "custom"   → use `dateFormat` (date-fns tokens)
     */
    mode?: DisplayMode;
    /** date-fns format string used when mode="custom". e.g. "dd/MM/yyyy HH:mm" */
    dateFormat?: string;
    /** Locale string for Intl formatting. Defaults to "en-BD" */
    locale?: string;
    /** Extra className applied to the wrapping <time> element */
    className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDate(value: string | Date | number): Date {
    return value instanceof Date ? value : new Date(value);
}

function formatRelative(date: Date): string {
    const now = Date.now();
    const diff = now - date.getTime();
    const abs = Math.abs(diff);
    const future = diff < 0;
    const prefix = future ? "in " : "";
    const suffix = future ? "" : " ago";

    if (abs < 60_000) return "just now";
    if (abs < 3_600_000) {
        const m = Math.round(abs / 60_000);
        return `${prefix}${m} minute${m !== 1 ? "s" : ""}${suffix}`;
    }
    if (abs < 86_400_000) {
        const h = Math.round(abs / 3_600_000);
        return `${prefix}${h} hour${h !== 1 ? "s" : ""}${suffix}`;
    }
    if (abs < 2_592_000_000) {
        const d = Math.round(abs / 86_400_000);
        return `${prefix}${d} day${d !== 1 ? "s" : ""}${suffix}`;
    }
    if (abs < 31_536_000_000) {
        const mo = Math.round(abs / 2_592_000_000);
        return `${prefix}${mo} month${mo !== 1 ? "s" : ""}${suffix}`;
    }
    const y = Math.round(abs / 31_536_000_000);
    return `${prefix}${y} year${y !== 1 ? "s" : ""}${suffix}`;
}

const MODE_INTL_OPTIONS: Record<
    Exclude<DisplayMode, "relative" | "custom">,
    Intl.DateTimeFormatOptions
> = {
    datetime: { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" },
    date: { day: "2-digit", month: "short", year: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    day: { weekday: "long" },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @example
 * // Default datetime
 * <DateDisplay value={parcel.createdAt} />
 *
 * // Date only
 * <DateDisplay value={parcel.createdAt} mode="date" />
 *
 * // Time only
 * <DateDisplay value={parcel.createdAt} mode="time" />
 *
 * // Day name
 * <DateDisplay value={parcel.createdAt} mode="day" />
 *
 * // Relative ("2 days ago")
 * <DateDisplay value={parcel.createdAt} mode="relative" />
 *
 * // Custom date-fns format
 * <DateDisplay value={parcel.createdAt} mode="custom" dateFormat="dd/MM/yyyy HH:mm" />
 * <DateDisplay value={parcel.createdAt} mode="custom" dateFormat="EEEE, MMM dd, yyyy, hh:mm aa" /> 
 */
export function DateDisplay({
    value,
    mode = "datetime",
    dateFormat = "PPpp",
    locale = "en-BD",
    className,
}: DateDisplayProps) {
    const date = toDate(value);
    const iso = date.toISOString();

    let display: string;

    if (mode === "relative") {
        display = formatRelative(date);
    } else if (mode === "custom") {
        display = format(date, dateFormat);
    } else {
        display = date.toLocaleDateString(locale, MODE_INTL_OPTIONS[mode]);
    }

    return (
        <time dateTime={iso} className={cn("text-sm", className)}>
            {display}
        </time>
    );
}

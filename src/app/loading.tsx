import { Truck } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const dotDelayClasses = ["[animation-delay:0ms]", "[animation-delay:150ms]", "[animation-delay:300ms]"];

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background">
            <Logo />

            {/* Spinner ring with brand icon inside */}
            <div className="relative flex items-center justify-center">
                {/* Outer spinning ring */}
                <svg
                    className="h-20 w-20 animate-spin animation-duration-[1.4s] text-primary"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="44 132"
                        className="opacity-80"
                    />
                </svg>

                {/* Static inner ring */}
                <svg
                    className="absolute h-20 w-20 text-primary/15"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" />
                </svg>

                {/* Brand icon in the center */}
                <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
            </div>

            {/* Animated dots */}
            <div className="flex items-center gap-1.5">
                {dotDelayClasses.map((delayClass, i) => (
                    <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full bg-primary animate-bounce animation-duration-[0.8s] ${delayClass}`}
                    />
                ))}
            </div>
        </div>
    );
}

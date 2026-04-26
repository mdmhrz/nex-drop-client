import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthIconProps {
  icon: LucideIcon;
  className?: string;
}

export function AuthIcon({ icon: Icon, className }: AuthIconProps) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}

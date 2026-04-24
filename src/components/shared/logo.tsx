import Image from "next/image";

interface LogoProps {
  showLogo?: boolean;
  showName?: boolean;
  className?: string;
}

export function Logo({ showLogo = true, showName = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLogo && (
        <Image
          src="/logo.svg"
          alt="NexDrop Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      )}
      {showName && <span className="text-xl font-bold">NexDrop</span>}
    </div>
  );
}

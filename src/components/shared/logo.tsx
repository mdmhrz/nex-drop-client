import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  showLogo?: boolean;
  showName?: boolean;
  className?: string;
  noLink?: boolean;
}

export function Logo({ showLogo = true, showName = true, className = "", noLink = false }: LogoProps) {
  const content = (
    <>
      {showLogo && (
        <Image
          src="/logo.svg"
          alt="NexDrop Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      )}
      {showName && <span className="text-xl section-heading-text font-bold hover:text-primary transition-all duration-300 font-nevera">NexDrop</span>}
    </>
  );

  if (noLink) {
    return <div className={`flex items-center space-x-2 ${className}`}>{content}</div>;
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {content}
    </Link>
  );
}

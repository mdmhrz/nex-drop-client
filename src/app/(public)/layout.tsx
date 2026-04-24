import { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Public header can be added here */}
      <main>{children}</main>
      {/* Public footer can be added here */}
    </div>
  );
}

import { ReactNode } from "react";
import { DashboardShell } from "@/components/layouts/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <DashboardShell user={{ name: user.name, email: user.email, role: user.role }}>
        {children}
      </DashboardShell>
    </div>
  );
}

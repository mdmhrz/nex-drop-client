import Footer from "@/components/home/footer/footer";
import Navbar from "@/components/home/navbar/navbar";
import { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh]">
      <div className="relavtive z-50 py-16">
        <Navbar />
      </div>
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}

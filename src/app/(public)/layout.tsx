import Footer from "@/components/home/footer/footer";
import Navbar from "@/components/home/navbar/navbar";
import { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <main>{children}</main>
      <Footer/>
    </div>
  );
}

import Navbar from "@/components/home/navbar/navbar";
import { Banner } from "@/components/home/banner";
import { HowItWorks } from "@/components/home/how-it-works/how-it-works";
import { OurServices } from "@/components/home/our-services/our-services";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col px-6 lg:px-0 pt-28">
      <Navbar />
      <Banner />
      <HowItWorks />
      <OurServices />
    </div>
  );
}

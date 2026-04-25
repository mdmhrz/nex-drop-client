import { Banner } from "@/components/home/banner";
import { HowItWorks } from "@/components/home/how-it-works/how-it-works";
import { OurServices } from "@/components/home/our-services/our-services";
import { Features } from "@/components/home/features/features";
import { ClientLogos } from "@/components/home/client-logos/client-logos";
import { BecomeAMerchant } from "@/components/home/become-a-merchant/become-a-merchant";
import Testimonials from "@/components/home/testimonials/testimonials";
import FaqSection from "@/components/home/faq/faq";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col px-6 lg:px-0 pt-28">    
      <Banner />
      <HowItWorks />
      <OurServices />
      <ClientLogos />
      <Features />
      <BecomeAMerchant />
      <Testimonials />
      <FaqSection />
    
    </div>
  );
}

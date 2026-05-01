import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { Banner } from "@/components/home/banner";
import { HowItWorks } from "@/components/home/how-it-works/how-it-works";
import { OurServices } from "@/components/home/our-services/our-services";
import { Features } from "@/components/home/features/features";
import { ClientLogos } from "@/components/home/client-logos/client-logos";
import { BecomeAMerchant } from "@/components/home/become-a-merchant/become-a-merchant";
import Testimonials from "@/components/home/testimonials/testimonials";
import FaqSection from "@/components/home/faq/faq";
import { getRecentReviews } from "@/services/rating.server";
import { RECENT_REVIEWS_KEY } from "@/hooks/use-ratings";

export const metadata = {
  title: "NexDrop",
}

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [...RECENT_REVIEWS_KEY, 6],
    queryFn: () => getRecentReviews(6),
  }).catch(() => { /* silently skip if API unavailable */ });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="">
        <Banner />
        <HowItWorks />
        <OurServices />
        <ClientLogos />
        <Features />
        <BecomeAMerchant />
        <Testimonials />
        <FaqSection />
      </div>
    </HydrationBoundary>
  );
}

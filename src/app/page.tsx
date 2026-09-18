import { Suspense } from 'react';
import {
  HeroSection,
  PillarsSection,
  WhySection,
  HowItWorks,
  FinalCTA,
} from '@/components/marketing';
import { NewsletterCapture } from '@/components/engagement/newsletter-capture';
import { SmartHome } from '@/features/onboarding/smart-home';

function MarketingPage() {
  return (
    <>
      <HeroSection />
      <PillarsSection />
      <WhySection />
      <HowItWorks />
      <NewsletterCapture />
      <FinalCTA />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<MarketingPage />}>
      <SmartHome marketingContent={<MarketingPage />} />
    </Suspense>
  );
}

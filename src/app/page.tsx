import {
  HeroSection,
  PillarsSection,
  PopularToolsGrid,
  CategoryShowcase,
  LiveDemo,
  WhySection,
  HowItWorks,
  ToolDirectory,
  FinalCTA,
} from '@/components/marketing';
import { NewsletterCapture } from '@/components/engagement/newsletter-capture';
import { SmartHome } from '@/features/onboarding/smart-home';

function MarketingPage() {
  return (
    <>
      <HeroSection />
      <PillarsSection />
      <PopularToolsGrid />
      <CategoryShowcase />
      <LiveDemo />
      <WhySection />
      <HowItWorks />
      <ToolDirectory />
      <NewsletterCapture />
      <FinalCTA />
    </>
  );
}

export default function HomePage() {
  return <SmartHome marketingContent={<MarketingPage />} />;
}

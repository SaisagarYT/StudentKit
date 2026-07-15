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
import { StreakBanner } from '@/components/engagement/streak-banner';
import { NewsletterCapture } from '@/components/engagement/newsletter-capture';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StreakBanner />
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

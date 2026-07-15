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

export default function HomePage() {
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

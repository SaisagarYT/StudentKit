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
      <FinalCTA />
    </>
  );
}

import {
  HeroSection,
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

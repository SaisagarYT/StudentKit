import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { StartFlow } from '@/features/onboarding/start-flow';

export const metadata: Metadata = {
  title: `Start Your Journey | ${siteConfig.name}`,
  description: 'Choose your goal and experience level to get a personalized learning path.',
};

export default function StartPage() {
  return <StartFlow />;
}

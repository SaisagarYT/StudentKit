import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ResumeRoaster } from '@/features/placement/resume-roaster';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: `ATS Resume Bullet & Project Roaster | ${siteConfig.name}`,
  description:
    'Instant ATS feedback on your resume project descriptions. Get scored, audited for tutorial clichés, and receive optimized STAR-formula rewrites with quantifiable metrics.',
  openGraph: {
    title: 'ATS Resume Bullet & Project Roaster | StudentKit',
    description: 'Find out why your resume is getting rejected. Score your project bullets and get Google STAR rewrites.',
    images: [{ url: '/og/placement.png', width: 1200, height: 630 }],
  },
};

export default function ResumeRoasterPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Placement', href: '/placement' },
          { label: 'Resume Roaster' },
        ])}
      />
      <div className="py-8 md:py-12">
        <div className="container-main max-w-5xl">
          <Link
            href="/placement"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Placement Hub
          </Link>

          <ResumeRoaster />
        </div>
      </div>
    </>
  );
}


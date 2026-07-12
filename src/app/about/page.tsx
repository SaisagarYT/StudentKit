import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description: 'StudentKit provides free, fast, and private tools for students — built to help you get answers and move on.',
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">About StudentKit</h1>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <p className="text-body-lg">
            StudentKit is a collection of free tools built for students, exam
            aspirants, and early-career professionals. We believe essential
            utilities shouldn&apos;t require sign-ups, subscriptions, or compromises
            on privacy.
          </p>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Why we built this
          </h2>
          <p>
            Students need quick answers — attendance percentages, GPA calculations,
            salary estimates, document formatting. Most existing tools are cluttered
            with ads, require unnecessary accounts, or send your data to servers
            when it could be processed locally.
          </p>
          <p>
            StudentKit does things differently. Every calculator runs directly in your
            browser. Image processing happens on your device. No data leaves your
            machine unless you choose to share it.
          </p>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Our principles
          </h2>
          <ul className="space-y-3 list-none">
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">01</span>
              <span><strong className="text-[var(--text-primary)]">Fast.</strong> Get your answer in seconds, not minutes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">02</span>
              <span><strong className="text-[var(--text-primary)]">Private.</strong> Client-side processing wherever possible.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">03</span>
              <span><strong className="text-[var(--text-primary)]">Free.</strong> No paywalls for essential student tools.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--accent-primary)] font-semibold shrink-0">04</span>
              <span><strong className="text-[var(--text-primary)]">Accurate.</strong> Transparent formulas you can verify.</span>
            </li>
          </ul>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            What&apos;s next
          </h2>
          <p>
            We&apos;re continuously adding new tools based on what students actually
            need. If you have suggestions, reach out through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: 'How StudentKit handles your data — most processing happens locally in your browser.',
};

export default function PrivacyPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[var(--text-subtle)]">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Overview
            </h2>
            <p>
              StudentKit is designed with privacy as a core principle. Most tools
              process data entirely within your browser — nothing is sent to our
              servers unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Data we collect
            </h2>
            <p className="mb-3">We may collect:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Basic analytics (page views, tool usage counts) via privacy-respecting analytics</li>
              <li>Error reports to improve tool reliability</li>
              <li>Information you voluntarily provide through contact forms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Data we do NOT collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Your calculation inputs or results</li>
              <li>Images you upload for compression or resizing</li>
              <li>Personal academic information (grades, attendance)</li>
              <li>Financial information (salary, CTC details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Local processing
            </h2>
            <p>
              All calculators run entirely in your browser using JavaScript. Image
              processing tools use the HTML5 Canvas API on your device. No files
              are uploaded to any server.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Cookies
            </h2>
            <p>
              We use essential cookies only for basic site functionality. We do not
              use tracking cookies or share data with advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Third-party services
            </h2>
            <p>
              We may use privacy-respecting analytics services. We do not sell,
              rent, or share your personal data with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. Significant changes will
              be communicated through a notice on the website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Contact
            </h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href="mailto:hello@studentkit.app" className="text-[var(--text-primary)] underline underline-offset-4">
                hello@studentkit.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

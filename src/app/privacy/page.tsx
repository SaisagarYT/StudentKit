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
              Cookies & Advertising Technologies
            </h2>
            <p className="mb-3">
              We use cookies and similar technologies to ensure core website functionality, analyze traffic, and display relevant advertisements through Google AdSense.
            </p>
            <p className="mb-3">
              <strong>Google AdSense & Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the Internet.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm mb-3">
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to StudentKit and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-dark)] underline underline-offset-4"
                >
                  Google Ads Settings
                </a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-dark)] underline underline-offset-4"
                >
                  aboutads.info
                </a>.
              </li>
              <li>
                To learn more about how Google collects and processes data when you use sites that partner with Google, please visit{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-dark)] underline underline-offset-4"
                >
                  How Google uses information from sites or apps that use our services
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Analytics & Measurement
            </h2>
            <p>
              We use Google Analytics to understand website traffic, user engagement, and performance trends. These analytics services collect aggregated, pseudonymous metrics (such as page views, device types, and session duration) to help us improve user experience.
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

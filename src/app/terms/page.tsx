import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Terms of Use | ${siteConfig.name}`,
  description: 'Terms and conditions for using StudentKit tools and services.',
};

export default function TermsPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">Terms of Use</h1>
        <p className="mt-3 text-sm text-[var(--text-subtle)]">
          Last updated: July 2026
        </p>

        <div className="mt-8 space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Acceptance of terms
            </h2>
            <p>
              By accessing and using StudentKit ({siteConfig.domain}), you agree
              to these terms. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Use of tools
            </h2>
            <p>
              StudentKit provides free online calculators and utilities for
              educational and informational purposes. You may use these tools for
              personal, educational, and professional purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Accuracy disclaimer
            </h2>
            <p>
              While we strive for accuracy, the results provided by our tools are
              for informational purposes only. They should not be considered as
              professional financial, legal, or academic advice. Always verify
              important calculations with your institution or a qualified
              professional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Intellectual property
            </h2>
            <p>
              The StudentKit name, logo, design, and content are protected by
              intellectual property laws. You may not reproduce, distribute, or
              create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Limitation of liability
            </h2>
            <p>
              StudentKit is provided &ldquo;as is&rdquo; without warranties of any
              kind. We are not liable for any damages arising from the use of our
              tools, including but not limited to incorrect calculations, data loss,
              or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Modifications
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use
              of the service after changes constitutes acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Contact
            </h2>
            <p>
              Questions about these terms? Contact us at{' '}
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

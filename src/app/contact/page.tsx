import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Contact | ${siteConfig.name}`,
  description: 'Get in touch with the StudentKit team — feedback, suggestions, or questions.',
};

export default function ContactPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">Contact</h1>

        <div className="mt-8 space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <p className="text-body-lg">
            Have feedback, a tool suggestion, or found something that doesn&apos;t
            work as expected? We&apos;d like to hear from you.
          </p>

          <div className="p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-subtle)]">
                <Mail className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Email</p>
                <a
                  href="mailto:hello@studentkit.app"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  hello@studentkit.app
                </a>
              </div>
            </div>
            <p className="text-sm text-[var(--text-subtle)]">
              We typically respond within 48 hours.
            </p>
          </div>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            What to include
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Which tool you&apos;re referring to (if applicable)</li>
            <li>What you expected vs. what happened</li>
            <li>Your browser and device (for bug reports)</li>
            <li>Screenshots if relevant</li>
          </ul>

          <h2 className="text-h3 font-semibold text-[var(--text-primary)] pt-4">
            Suggest a tool
          </h2>
          <p>
            If there&apos;s a calculator or utility you wish existed for students,
            let us know. The best suggestions are specific (&ldquo;GATE score
            predictor&rdquo; not &ldquo;more exam tools&rdquo;) and describe why
            it&apos;s useful.
          </p>
        </div>
      </div>
    </div>
  );
}

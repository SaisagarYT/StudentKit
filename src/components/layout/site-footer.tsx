import Link from 'next/link';
import { Logo, LogoSymbol } from '@/components/brand/logo';
import { footerNavSections } from '@/config/navigation';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="container-main section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
              {siteConfig.tagline}. Fast, private, and built for students who
              need answers — not distractions.
            </p>
          </div>

          {/* Nav Columns */}
          {footerNavSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-subtle hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoSymbol className="w-5 h-5" />
            <span className="text-xs text-text-subtle">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
          <p className="text-xs text-text-subtle">
            {siteConfig.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}

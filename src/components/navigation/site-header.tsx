'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { mainNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-surface/90 backdrop-blur-md border-b border-border-soft shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container-main">
          <nav className="flex items-center justify-between h-16 md:h-18">
            {/* Left: Logo */}
            <Logo />

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-subtle/60"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-subtle border border-border-soft rounded-lg hover:border-border hover:text-text-secondary transition-all"
                aria-label="Search tools (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-text-subtle bg-subtle rounded font-mono">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/tools"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent-dark text-text-inverse rounded-lg hover:bg-accent-dark/90 transition-colors"
              >
                Explore Tools
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-subtle transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border-soft p-6 shadow-lg">
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary rounded-lg hover:bg-subtle transition-colors"
                >
                  {item.label}
                  <ArrowRight className="w-4 h-4 text-text-subtle" />
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-border-soft">
              <Link
                href="/tools"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-accent-dark text-text-inverse rounded-lg"
              >
                Explore All Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-18" />
    </>
  );
}

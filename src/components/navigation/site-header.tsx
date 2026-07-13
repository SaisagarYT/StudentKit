'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { Logo } from '@/components/brand/logo';
import { CommandPalette } from '@/components/search/command-palette';
import { mainNavItems } from '@/config/navigation';
import { tools } from '@/config/tools';
import { categories } from '@/config/categories';
import { cn } from '@/lib/utils';

function getIcon(name: string, className?: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-4 h-4'} /> : null;
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaContentRef = useRef<HTMLDivElement>(null);
  const megaTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isMegaOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMegaOpen]);

  // Close mega menu on route change
  useEffect(() => {
    setIsMegaOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Animate mega menu
  useEffect(() => {
    if (!megaRef.current || !megaContentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isMegaOpen) {
      megaRef.current.style.display = 'block';

      if (prefersReducedMotion) {
        gsap.set(megaRef.current, { opacity: 1 });
        gsap.set(megaContentRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline();
      megaTimelineRef.current = tl;

      tl.fromTo(
        megaRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      tl.fromTo(
        megaContentRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
        '-=0.1'
      );

      const columns = megaContentRef.current.querySelectorAll('[data-mega-col]');
      tl.fromTo(
        columns,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' },
        '-=0.25'
      );
    } else {
      if (megaTimelineRef.current) {
        megaTimelineRef.current.kill();
      }

      if (prefersReducedMotion) {
        if (megaRef.current) megaRef.current.style.display = 'none';
        return;
      }

      gsap.to(megaRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          if (megaRef.current) megaRef.current.style.display = 'none';
        },
      });
    }
  }, [isMegaOpen]);

  const handleMegaEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaOpen(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 150);
  }, []);

  const toolsByCategory = categories.map((cat) => ({
    category: cat,
    tools: tools.filter((t) => t.category === cat.slug),
  }));

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
              {/* Tools with mega dropdown trigger */}
              <button
                type="button"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
                onClick={() => setIsMegaOpen(!isMegaOpen)}
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                  isMegaOpen
                    ? 'text-text-primary bg-subtle/60'
                    : 'text-text-secondary hover:text-text-primary hover:bg-subtle/60'
                )}
              >
                Tools
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    isMegaOpen && 'rotate-180'
                  )}
                />
              </button>

              {mainNavItems.filter(item => item.label !== 'Tools').map((item) => (
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
                onClick={() => setIsSearchOpen(true)}
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

        {/* Mega Dropdown */}
        <div
          ref={megaRef}
          onMouseEnter={handleMegaEnter}
          onMouseLeave={handleMegaLeave}
          className="hidden absolute top-full left-0 right-0 w-full max-h-[calc(100vh-4rem)] overflow-y-auto"
          style={{ display: 'none' }}
        >
          <div className="border-b border-[var(--border-soft)] bg-[var(--bg-surface)] shadow-xl">
            <div ref={megaContentRef} className="container-main py-8 md:py-10">
              {/* Top row: heading + browse all */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                    All Tools
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Free calculators and utilities — fast, private, browser-based.
                  </p>
                </div>
                <Link
                  href="/tools"
                  onClick={() => setIsMegaOpen(false)}
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-[var(--border-soft)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all"
                >
                  View all tools
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Category columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-5">
                {toolsByCategory.map((group) => (
                  <div key={group.category.slug} data-mega-col>
                    {/* Category header */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{ backgroundColor: `${group.category.accent}20` }}
                      >
                        {getIcon(group.category.icon, 'w-4 h-4')}
                      </div>
                      <div>
                        <Link
                          href={`/categories/${group.category.slug}`}
                          onClick={() => setIsMegaOpen(false)}
                          className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent-dark)] transition-colors"
                        >
                          {group.category.title}
                        </Link>
                        <p className="text-[11px] text-[var(--text-subtle)] leading-tight">
                          {group.tools.length} tools
                        </p>
                      </div>
                    </div>

                    {/* Tool links */}
                    <div className="space-y-0.5">
                      {group.tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setIsMegaOpen(false)}
                          className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--bg-subtle)] group-hover/item:bg-[var(--bg-surface)] border border-transparent group-hover/item:border-[var(--border-soft)] transition-all shrink-0">
                            {getIcon(tool.icon, 'w-3.5 h-3.5 text-[var(--text-secondary)]')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                              {tool.title}
                            </p>
                            <p className="text-[11px] text-[var(--text-subtle)] truncate">
                              {tool.shortDescription}
                            </p>
                          </div>
                          <ArrowRight className="w-3 h-3 text-[var(--text-subtle)] opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
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
          <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border-soft p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {/* Tools section in mobile */}
              <div className="mb-2">
                <p className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-text-subtle">
                  Tools
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary rounded-lg hover:bg-subtle transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      {getIcon(cat.icon, 'w-4 h-4 text-text-secondary')}
                      {cat.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-subtle" />
                  </Link>
                ))}
              </div>

              <div className="my-2 border-t border-border-soft" />

              {/* Other nav items */}
              {mainNavItems.filter(item => item.label !== 'Tools').map((item) => (
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

      {/* Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-18" />
    </>
  );
}

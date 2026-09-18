'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowRight, ChevronDown, Bookmark, User, LogIn, LayoutDashboard } from 'lucide-react';
import { useUserAuth } from '@/lib/firebase/user-auth';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { Logo } from '@/components/brand/logo';
import { CommandPalette } from '@/components/search/command-palette';
import { BookmarksPanel } from '@/components/engagement/bookmarks-panel';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { mainNavItems, secondaryNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';

function getIcon(name: string, className?: string) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-4 h-4'} /> : null;
}

function UserButton() {
  const { user, loading } = useUserAuth();

  if (loading) {
    return <div className="hidden sm:block w-9 h-9" />;
  }

  if (user) {
    return (
      <Link
        href="/profile"
        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-sm overflow-hidden hover:ring-2 hover:ring-[var(--accent-primary)]/50 transition-all"
        aria-label="Profile"
      >
        {user.photoURL ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={user.photoURL} alt="" className="w-9 h-9 rounded-sm object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center text-xs font-bold">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium text-text-subtle hover:text-text-primary hover:bg-subtle transition-all"
      aria-label="Sign In"
    >
      <LogIn className="w-3.5 h-3.5" />
      Sign In
    </Link>
  );
}

function MobileAuthLink({ onClose }: { onClose: () => void }) {
  const { user, loading } = useUserAuth();

  if (loading) return null;

  if (user) {
    return (
      <Link
        href="/profile"
        onClick={onClose}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium border border-border-soft text-text-primary rounded-sm hover:bg-subtle transition-colors"
      >
        <User className="w-4 h-4" />
        My Profile
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onClose}
      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium border border-border-soft text-text-primary rounded-sm hover:bg-subtle transition-colors"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Link>
  );
}

function NavDropdown({ group, isActive }: { group: typeof mainNavItems[number]; isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  }, []);

  useEffect(() => {
    if (!dropdownRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -4, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-sm transition-colors',
          isActive
            ? 'text-text-primary bg-subtle/60'
            : 'text-text-secondary hover:text-text-primary hover:bg-subtle/60'
        )}
      >
        {getIcon(group.icon, 'w-4 h-4')}
        <span className="ml-1">{group.label}</span>
        <ChevronDown
          className={cn(
            'w-3 h-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-72 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-sm shadow-lg overflow-hidden z-50"
        >
          <div className="p-2">
            {group.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 px-3 py-2.5 rounded-sm hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-[var(--bg-subtle)] group-hover:bg-[var(--bg-surface)] border border-transparent group-hover:border-[var(--border-soft)] transition-all shrink-0 mt-0.5">
                  {child.icon && getIcon(child.icon, 'w-4 h-4 text-[var(--text-secondary)]')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {child.label}
                  </p>
                  {child.description && (
                    <p className="text-xs text-[var(--text-subtle)] mt-0.5 leading-relaxed">
                      {child.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--border-soft)] px-2 py-2">
            <Link
              href={group.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] rounded-sm hover:bg-[var(--bg-subtle)] transition-colors"
            >
              View all {group.label.toLowerCase()}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isGroupActive = (group: typeof mainNavItems[number]) => {
    return group.children.some((child) => pathname.startsWith(child.href)) || pathname === group.href;
  };

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
            <div className="hidden lg:flex items-center gap-0.5">
              {mainNavItems.map((group) => (
                <NavDropdown
                  key={group.label}
                  group={group}
                  isActive={isGroupActive(group)}
                />
              ))}

              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-subtle hover:text-text-secondary hover:bg-subtle/60 transition-colors rounded-sm"
                >
                  {item.icon && getIcon(item.icon, 'w-3.5 h-3.5')}
                  <span className="ml-0.5">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                data-tour="search"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-subtle border border-border-soft rounded-sm hover:border-border hover:text-text-secondary transition-all"
                aria-label="Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-text-subtle bg-subtle rounded-sm font-mono">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => setIsBookmarksOpen(true)}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-sm text-text-subtle hover:text-text-primary hover:bg-subtle transition-all"
                aria-label="Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              <UserButton />

              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent-dark text-text-inverse rounded-sm hover:bg-accent-dark/90 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-sm hover:bg-subtle transition-colors"
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
          <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border-soft p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col gap-4">
              {mainNavItems.map((group) => (
                <div key={group.label}>
                  <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-subtle flex items-center gap-2">
                    {getIcon(group.icon, 'w-3.5 h-3.5')}
                    {group.label}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {group.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-text-primary rounded-sm hover:bg-subtle transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          {child.icon && getIcon(child.icon, 'w-4 h-4 text-text-secondary')}
                          {child.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-text-subtle" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-border-soft pt-3">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-subtle">
                  More
                </p>
                <div className="mt-1 space-y-0.5">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-text-primary rounded-sm hover:bg-subtle transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        {item.icon && getIcon(item.icon, 'w-4 h-4 text-text-secondary')}
                        {item.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-subtle" />
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="mt-6 pt-6 border-t border-border-soft space-y-3">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-accent-dark text-text-inverse rounded-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <MobileAuthLink onClose={() => setIsMobileMenuOpen(false)} />
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Bookmarks Panel */}
      <BookmarksPanel isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-18" />
    </>
  );
}

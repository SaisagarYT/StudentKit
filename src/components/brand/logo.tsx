import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showSymbol?: boolean;
}

export function Logo({ className, showSymbol = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 group', className)}
      aria-label="StudentKit — Home"
    >
      {showSymbol && <LogoSymbol className="w-7 h-7" />}
      <span className="font-semibold text-lg tracking-tight text-text-primary">
        Student<span className="text-text-primary">Kit</span>
      </span>
    </Link>
  );
}

export function LogoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* Geometric brand mark: overlapping angular shapes */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        fill="var(--accent-primary)"
      />
      <rect
        x="12"
        y="12"
        width="16"
        height="16"
        rx="3"
        fill="var(--text-primary)"
      />
      <rect
        x="12"
        y="12"
        width="8"
        height="8"
        rx="2"
        fill="var(--accent-primary)"
      />
    </svg>
  );
}

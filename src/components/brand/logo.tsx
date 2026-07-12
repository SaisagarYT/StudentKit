import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showSymbol?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className, showSymbol = true, variant = 'dark' }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5 group', className)}
      aria-label="StudentKit — Home"
    >
      {showSymbol && <LogoSymbol className="w-8 h-8" variant={variant} />}
      <span className="font-semibold text-lg tracking-tight text-text-primary">
        Student<span className="text-text-primary">Kit</span>
      </span>
    </Link>
  );
}

export function LogoSymbol({
  className,
  variant = 'dark',
}: {
  className?: string;
  variant?: 'light' | 'dark';
}) {
  return (
    <Image
      src={variant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="StudentKit"
      width={32}
      height={32}
      unoptimized
      className={cn('shrink-0 object-cover', className)}
      aria-hidden="true"
    />
  );
}

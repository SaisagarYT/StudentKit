import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium font-mono transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-secondary)]',
        college: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]',
        exams: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]',
        career: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]',
        documents: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]',
        developer: 'bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]',
        accent: 'bg-[var(--accent-dark)] text-[var(--text-inverse)]',
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

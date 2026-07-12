import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
        college: 'bg-[var(--accent-college)]/20 text-[#6B4FBF]',
        exams: 'bg-[var(--accent-exams)]/20 text-[#8B6B00]',
        career: 'bg-[var(--accent-career)]/20 text-[#A85A00]',
        documents: 'bg-[var(--accent-documents)]/20 text-[#0F766E]',
        accent: 'bg-[var(--accent-primary)]/20 text-[var(--text-primary)]',
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

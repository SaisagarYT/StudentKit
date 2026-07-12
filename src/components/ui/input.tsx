import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border bg-[var(--bg-surface)] px-3.5 py-2 text-sm text-[var(--text-primary)] transition-colors',
          'placeholder:text-[var(--text-subtle)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]'
            : 'border-[var(--border-default)] hover:border-[var(--border-strong)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

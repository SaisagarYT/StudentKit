'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
      <div className="container-main text-center">
        <span className="text-6xl md:text-7xl font-bold tracking-tighter text-[var(--color-error)]/30 select-none">
          Error
        </span>
        <h1 className="mt-4 text-h2 font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
          An unexpected error occurred. This has been logged and we&apos;ll look
          into it.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

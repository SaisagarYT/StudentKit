'use client';

import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  handler,
  enabled = true,
}: ShortcutOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = ctrlKey ? event.ctrlKey : true;
      const matchesMeta = metaKey ? event.metaKey : true;
      const matchesShift = shiftKey ? event.shiftKey : true;

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift) {
        event.preventDefault();
        handler();
      }
    },
    [key, ctrlKey, metaKey, shiftKey, handler, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

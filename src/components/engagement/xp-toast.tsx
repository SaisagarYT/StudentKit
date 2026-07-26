'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';
import type { XpEvent } from '@/lib/xp';

interface ToastItem {
  id: number;
  event: XpEvent;
  visible: boolean;
}

let toastId = 0;

export function XpToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((event: XpEvent) => {
    const id = ++toastId;
    setToasts((prev) => [...prev.slice(-3), { id, event, visible: true }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
    }, 2500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    function handleXp(e: Event) {
      const detail = (e as CustomEvent<XpEvent>).detail;
      if (detail) addToast(detail);
    }
    window.addEventListener('sk-xp-earned', handleXp);
    return () => window.removeEventListener('sk-xp-earned', handleXp);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-soft)] shadow-sm pointer-events-auto transition-all duration-300 rounded-sm ${
            toast.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="w-7 h-7 rounded-sm bg-[var(--accent-dark)]/10 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--accent-dark)] tabular-nums">
              +{toast.event.points} XP
            </p>
            {toast.event.label && (
              <p className="text-[10px] text-[var(--text-subtle)] leading-tight">
                {toast.event.label}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

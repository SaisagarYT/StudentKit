'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/cms/analytics';

export function TrackView({ type, slug }: { type: 'roadmap' | 'project'; slug: string }) {
  useEffect(() => {
    trackPageView(type, slug);
  }, [type, slug]);

  return null;
}

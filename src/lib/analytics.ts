type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function trackEvent({ action, category, label, value }: GtagEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackToolUsage(toolName: string) {
  trackEvent({ action: 'tool_used', category: 'tools', label: toolName });
}

export function trackRoadmapProgress(roadmapSlug: string, topicId: string) {
  trackEvent({ action: 'topic_completed', category: 'roadmaps', label: `${roadmapSlug}/${topicId}` });
}

export function trackSearch(query: string) {
  trackEvent({ action: 'search', category: 'engagement', label: query });
}

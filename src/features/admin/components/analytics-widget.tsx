'use client';

import { useEffect, useState } from 'react';
import { getTopContent, type ContentAnalytics } from '@/lib/cms/analytics';
import { TrendingUp, Eye, Map, FolderOpen, Loader2 } from 'lucide-react';

export function AnalyticsWidget() {
  const [data, setData] = useState<ContentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopContent(8).then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Top Content</h2>
        </div>
        <span className="text-xs text-[var(--text-subtle)]">By page views</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--text-subtle)]" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8">
          <Eye className="w-8 h-8 mx-auto text-[var(--text-subtle)] mb-2" />
          <p className="text-xs text-[var(--text-subtle)]">No analytics data yet. Views are tracked when users visit published content.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.map((item, i) => (
            <div key={`${item.type}:${item.slug}`} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[var(--text-subtle)] bg-[var(--bg-subtle)]">
                {i + 1}
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {item.type === 'roadmap' ? (
                  <Map className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                ) : (
                  <FolderOpen className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                )}
                <span className="text-sm text-[var(--text-primary)] truncate">{item.slug.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Eye className="w-3 h-3 text-[var(--text-subtle)]" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { NotesPageClient } from '@/features/notes/notes-page-client';

export const metadata: Metadata = {
  title: `Notes & Bookmarks | ${siteConfig.name}`,
  description: 'Your saved bookmarks with personal annotations. Quick access to tools, roadmaps, and projects you care about.',
};

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NotesPageClient />
    </Suspense>
  );
}

'use client';

import { Suspense } from 'react';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { RoadmapEditForm } from '@/features/admin/components/roadmap-edit-form';
import { Loader2 } from 'lucide-react';

export default function EditRoadmapPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>}>
        <RoadmapEditForm />
      </Suspense>
    </AdminShell>
  );
}

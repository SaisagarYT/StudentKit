'use client';

import { Suspense } from 'react';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { ProjectEditForm } from '@/features/admin/components/project-edit-form';
import { Loader2 } from 'lucide-react';

export default function EditProjectPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>}>
        <ProjectEditForm />
      </Suspense>
    </AdminShell>
  );
}

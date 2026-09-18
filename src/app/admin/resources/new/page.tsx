'use client';

import { Suspense } from 'react';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { ResourceForm } from '@/features/admin/components/resource-form';
import { Loader2 } from 'lucide-react';

export default function AdminNewResourcePage() {
  return (
    <AdminShell>
      <ResourceForm mode="create" />
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" />
        </div>
      }>
        <ResourceForm mode="create" />
      </Suspense>
    </AdminShell>
  );
}


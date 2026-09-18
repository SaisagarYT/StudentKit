'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { ResourceForm } from '@/features/admin/components/resource-form';
import { Loader2 } from 'lucide-react';

function EditResourceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="p-8 text-center text-xs text-[var(--text-subtle)]">
        No resource ID specified.
      </div>
    );
  }

  return <ResourceForm mode="edit" resourceId={id} />;
}

export default function AdminEditResourcePage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>}>
        <EditResourceContent />
      </Suspense>
    </AdminShell>
  );
}


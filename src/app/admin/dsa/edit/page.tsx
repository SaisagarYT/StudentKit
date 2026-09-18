'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/features/admin/components/admin-shell';
import { DsaProblemForm } from '@/features/admin/components/dsa-problem-form';
import { Loader2 } from 'lucide-react';

function EditDsaContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="p-8 text-center text-xs text-[var(--text-subtle)] font-mono">
        No problem ID specified.
      </div>
    );
  }

  return <DsaProblemForm mode="edit" problemId={id} />;
}

export default function AdminEditDsaProblemPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-subtle)]" /></div>}>
        <EditDsaContent />
      </Suspense>
    </AdminShell>
  );
}


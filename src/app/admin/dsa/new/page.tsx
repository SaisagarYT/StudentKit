'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { DsaProblemForm } from '@/features/admin/components/dsa-problem-form';

export default function AdminNewDsaProblemPage() {
  return (
    <AdminShell>
      <DsaProblemForm mode="create" />
    </AdminShell>
  );
}


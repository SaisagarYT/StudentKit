'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { ProjectForm } from '@/features/admin/components/project-form';

export default function NewProjectPage() {
  return (
    <AdminShell>
      <ProjectForm />
    </AdminShell>
  );
}

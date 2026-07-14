'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { ProjectsList } from '@/features/admin/components/projects-list';

export default function AdminProjectsPage() {
  return (
    <AdminShell>
      <ProjectsList />
    </AdminShell>
  );
}

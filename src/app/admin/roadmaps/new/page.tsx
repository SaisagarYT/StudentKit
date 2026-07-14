'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { RoadmapForm } from '@/features/admin/components/roadmap-form';

export default function NewRoadmapPage() {
  return (
    <AdminShell>
      <RoadmapForm />
    </AdminShell>
  );
}

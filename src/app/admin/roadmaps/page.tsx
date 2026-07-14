'use client';

import { AdminShell } from '@/features/admin/components/admin-shell';
import { RoadmapsList } from '@/features/admin/components/roadmaps-list';

export default function AdminRoadmapsPage() {
  return (
    <AdminShell>
      <RoadmapsList />
    </AdminShell>
  );
}

import { AdminShell } from '@/features/admin/components/admin-shell';
import { ResourcesDashboard } from '@/features/admin/components/resources-dashboard';

export default function AdminResourcesPage() {
  return (
    <AdminShell>
      <ResourcesDashboard />
    </AdminShell>
  );
}

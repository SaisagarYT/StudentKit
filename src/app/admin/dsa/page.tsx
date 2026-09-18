import { AdminShell } from '@/features/admin/components/admin-shell';
import { DsaDashboard } from '@/features/admin/components/dsa-dashboard';

export default function AdminDsaPage() {
  return (
    <AdminShell>
      <DsaDashboard />
    </AdminShell>
  );
}


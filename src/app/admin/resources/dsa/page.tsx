import { AdminShell } from '@/features/admin/components/admin-shell';
import { DsaProblemCreator } from '@/features/admin/components/dsa-problem-creator';

export default function DsaCreatorPage() {
  return (
    <AdminShell>
      <DsaProblemCreator />
    </AdminShell>
  );
}

'use client';

import { useUserAuth } from '@/lib/firebase/user-auth';
import { ReturningDashboard } from './returning-dashboard';

interface SmartHomeProps {
  marketingContent: React.ReactNode;
}

export function SmartHome({ marketingContent }: SmartHomeProps) {
  const { user, loading } = useUserAuth();

  if (loading) {
    return <>{marketingContent}</>;
  }

  // If user is logged in, show SaaS dashboard
  if (user) {
    return <ReturningDashboard />;
  }

  // Otherwise show public landing page
  return <>{marketingContent}</>;
}

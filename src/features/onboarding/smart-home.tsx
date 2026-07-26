'use client';

import { useState, useEffect } from 'react';
import { ReturningDashboard, hasExistingProgress } from './returning-dashboard';

interface SmartHomeProps {
  marketingContent: React.ReactNode;
}

export function SmartHome({ marketingContent }: SmartHomeProps) {
  const [isReturning, setIsReturning] = useState<boolean | null>(null);

  useEffect(() => {
    setIsReturning(hasExistingProgress());
  }, []);

  useEffect(() => {
    if (isReturning) {
      document.body.setAttribute('data-no-footer', 'true');
    } else {
      document.body.removeAttribute('data-no-footer');
    }
    return () => document.body.removeAttribute('data-no-footer');
  }, [isReturning]);

  if (isReturning === null) {
    return <>{marketingContent}</>;
  }

  if (isReturning) {
    return <ReturningDashboard />;
  }

  return <>{marketingContent}</>;
}

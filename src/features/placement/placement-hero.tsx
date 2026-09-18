'use client';

import { PlacementHeader } from './components/placement-header';
import { PlacementReadinessStrip } from './components/placement-readiness-strip';
import { PlacementPillars } from './components/placement-pillars';
import { CompanyTracksGrid } from './components/company-tracks-grid';
import { PlacementPlaybook } from './components/placement-playbook';
import { PlacementCta } from './components/placement-cta';

export function PlacementHero() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10 md:py-16">
      <div className="container-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header with proof counters */}
        <PlacementHeader />

        {/* 2. Live Personal Readiness & Streak Strip */}
        <PlacementReadinessStrip />

        {/* 3. Three Core Pillars (DSA Sheet, CS Core, Interview Q&A) */}
        <PlacementPillars />

        {/* 4. Company-Wise Evaluation Grid (FAANG, Unicorns, Enterprise) */}
        <CompanyTracksGrid />

        {/* 5. 6-Month Chronological Playbook */}
        <PlacementPlaybook />

        {/* 6. High-Converting Direct Action CTA */}
        <PlacementCta />
      </div>
    </div>
  );
}

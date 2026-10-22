# Module 1: Auth, Onboarding & Student Cockpit

## 1. Overview & Objectives
The purpose of Module 1 is to provide students with a frictionless, high-trust authentication and personalized cockpit experience.
- Frictionless sign-in with Google OAuth and Email/Password (with password reset flow).
- Immediate synchronization of offline/guest progress (DSA solved, challenges, bookmarks) into cloud Firestore upon authentication.
- Dedicated, distraction-free authentication pages (`/login` and `/register`) with complete removal of the platform navbar and global footer.
- A high-density, professional student cockpit (`/profile`) that serves as the daily home base for learning, streak tracking, and skill progression.
- Seamless dual-theme (Dark/Light) ergonomics matching the Linear/Vercel standard.

---

## 2. Architecture & Components
| Path | Purpose | Key Responsibilities |
| :--- | :--- | :--- |
| `src/app/login/page.tsx` | Route entry for `/login` | Metadata (`Sign In \| StudentKit`), renders `LoginForm` with `initialMode="login"`. |
| `src/app/register/page.tsx` | Route entry for `/register` | Metadata (`Create Account \| StudentKit`), renders `LoginForm` with `initialMode="signup"`. |
| `src/features/auth/login-form.tsx` | Core Dedicated Auth Component | Self-contained viewport layout with brand header, theme toggle, elevated auth card, password visibility toggle, forgot password flow, and guest access. |
| `src/components/layout/layout-shell.tsx` | Platform Shell Layout | Controls routing conditions (`NO_NAV_ROUTES = ['/login', '/register']`, `NO_FOOTER_ROUTES`), suppressing `<SiteHeader />`, `<ProductTour />`, and `<SiteFooter />` on auth pages. |
| `src/components/navigation/site-header.tsx` | Platform Header | Suppresses redundant "Dashboard" CTA when user is already on `/profile`. |
| `src/lib/firebase/user-auth.tsx` | Auth Context & Provider | Manages Firebase Auth lifecycle (`onAuthStateChanged`), cloud sync trigger, and sign-out cleanup. |
| `src/app/profile/page.tsx` | Student Cockpit Route | Metadata (`My Profile \| StudentKit`), renders `ProfileDashboard`. |
| `src/features/profile/profile-dashboard.tsx` | Student Cockpit Core | Displays streak, XP progression, interactive metric cards, full-width activity heatmap, category breakdown with actionable starter CTAs, and badges. |
| `src/app/profile/card/page.tsx` | Dev Card Share Route | Metadata (`Dev Card \| StudentKit`), renders `PublicProfileCard`. |

---

## 3. UI/UX Design System Compliance & Cockpit Elevation Plan

### A. Hero Section Cohesion
- Eliminate wide horizontal voids between profile info and stats.
- Group student avatar, name, email, level badge, and XP progression cleanly.
- Add live Cloud Sync status indicator (`● Synced with Cloud` / `Syncing...`).
- Display Guest Mode banner when unauthenticated with 1-click CTA to preserve progress.

### B. Metric Cards (Replacing Hollow Washer Rings)
- Replace empty hollow circles with 4 high-density metric cards:
  1. **DSA Practice**: Solved count, progress bar, direct "Practice DSA →" link.
  2. **CS Core Topics**: Topics done, direct "Explore CS →" link.
  3. **Engineering Roadmaps**: Active roadmap topics, direct "View Roadmaps →" link.
  4. **Skill Badges**: Earned count / total, direct "Dev Card →" link.

### C. Full-Width Architectural Activity Heatmap
- Expand heatmap from narrow 12-week island to balanced 20-24 week grid with month labels and day-of-week indicators.
- Display streak indicators (`Current Streak`, `Best Streak`, `Active Days`).

### D. Actionable Empty States ("Continue Learning" Hub)
- When 0 DSA questions solved, provide quick-start recommendations (e.g. *Two Sum &bull; Easy &bull; [Solve Now →]*).
- When 0 roadmaps active, provide top path shortcuts (Frontend, Fullstack, Backend).
- Category Breakdown: Show foundational categories with 0% progress bars and direct category practice buttons instead of an empty dead-end card.

### E. Redundant Header Button Removal
- Update `site-header.tsx` to omit the neon "Dashboard" button when `pathname === '/profile'`.

---

## 4. Verification & Testing Checklist
- [x] Navbar (`<SiteHeader />`) and Product Tour completely omitted on `/login` and `/register`.
- [x] Dedicated `/register` route provided with `initialMode="signup"`.
- [x] Metadata titles correct (`Sign In | StudentKit` and `Create Account | StudentKit`).
- [x] Self-contained top bar with logo, theme toggle, and home navigation on auth pages.
- [x] Google OAuth and Email/Password authentication functional.
- [x] Password visibility toggle implemented.
- [x] Password reset request flow included.
- [x] Dark and Light modes tested on Auth with zero contrast issues.
- [x] Fix metadata title duplication on `/profile` and `/profile/card`.
- [x] Hide redundant "Dashboard" button in header when on `/profile`.
- [x] Upgrade Hero Card with grouped stats and live Cloud Sync status.
- [x] Upgrade 4 Metric Cards with progress gauges and direct navigation links.
- [x] Upgrade Activity Heatmap to balanced architectural layout with month/day indicators.
- [x] Upgrade Category Breakdown with starter CTAs for 0-progress states.
- [x] Zero TypeScript errors (`npx tsc --noEmit`).
- [x] Zero ESLint warnings (`npm run lint`).
- [x] All test suites passing (`npx vitest run`).

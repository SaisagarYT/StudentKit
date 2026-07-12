# StudentKit

**Free Tools for College, Exams & Careers**

StudentKit is a production-quality web platform providing free interactive calculators and utilities for college students, competitive exam aspirants, and job seekers. All tools are fast, private (client-side processing), and designed for immediate usability.

**Live:** [studentkit.app](https://studentkit.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Tools](#available-tools)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 11 interactive tools across 4 categories
- Client-side image processing (no server uploads)
- GSAP-powered scroll animations with `prefers-reduced-motion` support
- Configuration-driven architecture — add new tools without touching layout code
- SEO-optimized with structured metadata, sitemap, and robots.txt
- Responsive design tested across 320px–1920px viewports
- WCAG 2.2 AA accessibility target
- Static generation for all pages (optimal Core Web Vitals)
- Firebase Hosting deployment-ready

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animation | GSAP 3 + ScrollTrigger |
| Forms | React Hook Form + Zod v4 |
| Icons | Lucide React |
| UI Primitives | Class Variance Authority (CVA) |
| Testing | Vitest + React Testing Library + Playwright |
| Deployment | Firebase Hosting |

---

## Getting Started

### Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm 9+

### Installation

```bash
git clone https://github.com/your-username/studentkit.git
cd studentkit
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) with Turbopack hot reload.

### Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── tools/              # Individual tool pages (11 routes)
│   ├── layout.tsx          # Root layout (fonts, metadata, shell)
│   ├── page.tsx            # Homepage
│   ├── robots.ts           # robots.txt generation
│   └── sitemap.ts          # Auto-generated sitemap from tool registry
│
├── components/
│   ├── brand/              # Logo, wordmark
│   ├── navigation/         # Header, mobile nav, search
│   ├── layout/             # Container, Section, ToolPageShell, Footer
│   ├── marketing/          # Homepage sections (hero, CTA, etc.)
│   └── ui/                 # Design system primitives (Button, Badge, Input)
│
├── features/               # Feature modules (business logic + UI)
│   ├── attendance/         # Calculator, schema, types, form, result
│   ├── cgpa/
│   ├── sgpa/
│   ├── percentage/
│   ├── age/
│   ├── salary/
│   └── image-processing/   # Compressor, resizer, signature resizer
│
├── config/                 # Static configuration
│   ├── site.ts             # Site metadata
│   ├── tools.ts            # Tool registry (single source of truth)
│   ├── categories.ts       # Category definitions
│   └── navigation.ts       # Nav items
│
├── hooks/                  # Custom React hooks
│   ├── use-gsap.ts         # GSAP animation hooks
│   ├── use-keyboard-shortcut.ts
│   ├── use-media-query.ts
│   └── use-debounce.ts
│
├── lib/                    # Shared utilities
│   ├── utils.ts            # cn() helper, formatters
│   ├── seo.ts              # Metadata generation helpers
│   └── animations.ts       # GSAP constants and easing presets
│
├── types/                  # Shared TypeScript types
└── tests/                  # Test setup and E2E specs
```

---

## Available Tools

### College

| Tool | Route | Description |
|------|-------|-------------|
| Attendance Calculator | `/tools/attendance-calculator` | Track attendance percentage, plan absences |
| CGPA Calculator | `/tools/cgpa-calculator` | Credit-weighted cumulative GPA |
| SGPA Calculator | `/tools/sgpa-calculator` | Single-semester GPA calculation |
| CGPA to Percentage | `/tools/cgpa-to-percentage` | Multi-formula CGPA conversion |
| Marks Percentage | `/tools/marks-percentage-calculator` | Simple marks-to-percentage |

### Exams

| Tool | Route | Description |
|------|-------|-------------|
| Age Calculator | `/tools/age-calculator` | Exact age with eligibility date support |

### Career

| Tool | Route | Description |
|------|-------|-------------|
| CTC to In-Hand | `/tools/ctc-to-inhand-calculator` | Salary breakdown with tax estimation |
| Salary Calculator | `/tools/salary-calculator` | Period-based salary conversion |

### Documents

| Tool | Route | Description |
|------|-------|-------------|
| Image Compressor | `/tools/image-compressor` | Client-side quality-based compression |
| Image Resizer | `/tools/image-resizer` | Pixel-accurate resize with aspect lock |
| Signature Resizer | `/tools/signature-resizer` | Exam-form presets (UPSC, SSC, GATE) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run unit tests (Vitest, watch mode) |
| `npm run test:run` | Run unit tests once |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run validate` | Full validation (typecheck + lint + build) |

---

## Architecture

### Configuration-Driven Tools

All tools are registered in `src/config/tools.ts`. Adding a new tool requires:

1. Add an entry to the tool registry
2. Create `src/app/tools/[slug]/page.tsx`
3. Create a feature module in `src/features/[name]/`

Navigation, search, sitemap, and category pages derive automatically from the registry.

### Feature Module Pattern

Each tool follows a consistent structure:

```
features/[name]/
├── [name].types.ts         # TypeScript interfaces
├── [name].schema.ts        # Zod validation (if form-based)
├── [name].calculator.ts    # Pure calculation functions
├── [name].test.ts          # Unit tests for calculations
├── [name]-form.tsx         # Interactive form component
└── [name]-result.tsx       # Result display component
```

Calculation functions are pure (no side effects, no React dependencies) and independently testable.

### Rendering Strategy

- All pages are statically generated at build time
- Client components are used only for interactive forms and animations
- Image processing uses browser Canvas API (zero server dependency)
- GSAP animations respect `prefers-reduced-motion`

---

## Design System

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#F7F7F2` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, inputs |
| `--accent-primary` | `#C7FF3D` | Brand accent (electric lime) |
| `--accent-dark` | `#151515` | Buttons, dark sections |
| `--text-primary` | `#111111` | Headings, primary text |
| `--text-secondary` | `#60605B` | Body text |
| `--text-subtle` | `#898982` | Hints, labels |

### Typography

- **Primary:** Geist (sans-serif)
- **Accent:** Instrument Serif (editorial headings only)
- **Scale:** Fluid `clamp()` from 0.75rem to 8rem

### Spacing

4px base unit with geometric scale (`--space-1` through `--space-40`). Section gaps use `clamp(4rem, 10vw, 10rem)`.

---

## Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting, use 'out' as public directory)
cp .firebaserc.example .firebaserc
# Edit .firebaserc with your project ID

# Build and deploy
npm run build
firebase deploy --only hosting
```

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_SITE_URL=https://studentkit.app
```

### CI/CD

The project includes `firebase.json` configured for static hosting with:
- Aggressive caching for immutable assets (JS, CSS, fonts, images)
- SPA fallback rewrites
- Optimized cache headers

---

## Testing

### Unit Tests

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

Calculator functions have dedicated test files testing edge cases (zero values, boundary conditions, invalid inputs).

### E2E Tests

```bash
npm run test:e2e
```

Playwright tests cover:
- Homepage rendering and navigation
- Tool search functionality
- Calculator workflows (input → result)
- Image tool upload flow
- Responsive navigation

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 95 |
| Lighthouse Accessibility | > 95 |
| Lighthouse Best Practices | > 95 |
| Lighthouse SEO | > 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

Achieved through:
- Static generation (no server runtime)
- Font optimization (`next/font` with `display: swap`)
- Minimal client-side JavaScript
- No external API calls for calculations
- Tree-shaken icon imports

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/tool-name`)
3. Follow the feature module pattern for new tools
4. Ensure `npm run validate` passes
5. Submit a pull request

### Code Standards

- TypeScript strict mode — no `any` without justification
- Pure functions for all calculations
- Components under 150 lines
- No comments unless explaining non-obvious constraints
- Accessibility: semantic HTML, ARIA only where native semantics are insufficient

---

## License

Copyright 2024 StudentKit. All rights reserved.

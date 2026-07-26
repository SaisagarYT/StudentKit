'use client';

import { useState, useCallback } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Copy, Terminal, Check, FolderTree } from 'lucide-react';

/* ─── Preset types ─── */

interface FolderExplanation {
  folder: string;
  purpose: string;
}

interface Preset {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  tree: string;
  explanations: FolderExplanation[];
}

/* ─── Preset data ─── */

const presets: Preset[] = [
  {
    id: 'nextjs-app',
    name: 'Next.js (App Router)',
    shortDesc: 'Full-stack React with file-based routing',
    icon: '▲',
    tree: `my-nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   └── route.ts
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── forms/
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   └── use-debounce.ts
├── types/
│   └── index.ts
├── config/
│   └── site.ts
├── features/
│   └── auth/
│       ├── components/
│       └── actions.ts
├── public/
│   ├── images/
│   └── fonts/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json`,
    explanations: [
      { folder: 'app/', purpose: 'Routes, layouts, and API endpoints using the App Router convention' },
      { folder: 'components/', purpose: 'Reusable UI components organized by type (ui, layout, forms)' },
      { folder: 'lib/', purpose: 'Utility functions, constants, and shared logic' },
      { folder: 'hooks/', purpose: 'Custom React hooks for shared stateful logic' },
      { folder: 'types/', purpose: 'TypeScript type definitions and interfaces' },
      { folder: 'config/', purpose: 'App configuration, site metadata, and environment settings' },
      { folder: 'features/', purpose: 'Feature-specific code with co-located components and logic' },
      { folder: 'public/', purpose: 'Static assets served directly (images, fonts, favicons)' },
    ],
  },
  {
    id: 'react-vite',
    name: 'React + Vite',
    shortDesc: 'Fast SPA with Vite bundler',
    icon: '⚡',
    tree: `my-react-app/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── format.ts
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── globals.css
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json`,
    explanations: [
      { folder: 'src/components/', purpose: 'Reusable UI components and layout wrappers' },
      { folder: 'src/pages/', purpose: 'Top-level page components mapped to routes' },
      { folder: 'src/hooks/', purpose: 'Custom React hooks for reusable logic' },
      { folder: 'src/utils/', purpose: 'Helper functions and formatting utilities' },
      { folder: 'src/assets/', purpose: 'Static assets like images, fonts, and global styles' },
      { folder: 'src/services/', purpose: 'API clients and external service integrations' },
      { folder: 'src/types/', purpose: 'Shared TypeScript interfaces and type definitions' },
    ],
  },
  {
    id: 'express-api',
    name: 'Express.js API',
    shortDesc: 'RESTful backend with MVC pattern',
    icon: '{}',
    tree: `my-express-api/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.ts
│   │   └── validate.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── response.ts
│   └── config/
│       ├── database.ts
│       └── env.ts
├── tests/
│   └── user.test.ts
├── .env.example
├── tsconfig.json
└── package.json`,
    explanations: [
      { folder: 'src/controllers/', purpose: 'Request handlers that parse input and return responses' },
      { folder: 'src/routes/', purpose: 'Route definitions mapping URLs to controllers' },
      { folder: 'src/middleware/', purpose: 'Express middleware for auth, validation, and error handling' },
      { folder: 'src/models/', purpose: 'Database models and schema definitions' },
      { folder: 'src/services/', purpose: 'Business logic layer between controllers and models' },
      { folder: 'src/utils/', purpose: 'Shared utilities like logging and response formatting' },
      { folder: 'src/config/', purpose: 'Environment variables, database config, and app settings' },
    ],
  },
  {
    id: 'fastapi',
    name: 'FastAPI (Python)',
    shortDesc: 'Async Python API with type hints',
    icon: '🐍',
    tree: `my-fastapi-app/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   └── users.py
│   │       └── router.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── user.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── user_service.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_users.py
├── alembic/
│   └── versions/
├── requirements.txt
├── .env.example
└── pyproject.toml`,
    explanations: [
      { folder: 'app/api/', purpose: 'API route definitions, dependencies, and versioned endpoints' },
      { folder: 'app/core/', purpose: 'Core configuration, security utilities, and app settings' },
      { folder: 'app/models/', purpose: 'SQLAlchemy/ORM database models' },
      { folder: 'app/schemas/', purpose: 'Pydantic schemas for request/response validation' },
      { folder: 'app/services/', purpose: 'Business logic and data access layer' },
      { folder: 'app/utils/', purpose: 'General-purpose helper functions' },
      { folder: 'tests/', purpose: 'Test files with pytest fixtures and test cases' },
    ],
  },
  {
    id: 'flutter',
    name: 'Flutter',
    shortDesc: 'Cross-platform mobile with clean architecture',
    icon: '💙',
    tree: `my_flutter_app/
├── lib/
│   ├── main.dart
│   ├── core/
│   │   ├── constants/
│   │   │   └── app_constants.dart
│   │   ├── theme/
│   │   │   └── app_theme.dart
│   │   ├── network/
│   │   │   └── api_client.dart
│   │   └── utils/
│   │       └── validators.dart
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── pages/
│   │   │       ├── widgets/
│   │   │       └── bloc/
│   │   └── home/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   └── shared/
│       ├── widgets/
│       │   └── loading_indicator.dart
│       └── extensions/
│           └── string_extensions.dart
├── test/
│   └── features/
├── assets/
│   ├── images/
│   └── fonts/
├── pubspec.yaml
└── analysis_options.yaml`,
    explanations: [
      { folder: 'lib/core/', purpose: 'App-wide constants, themes, networking, and utilities' },
      { folder: 'lib/features/', purpose: 'Feature modules with clean architecture (data/domain/presentation)' },
      { folder: 'features/*/data/', purpose: 'Data sources, API models, and repository implementations' },
      { folder: 'features/*/domain/', purpose: 'Entities, repository contracts, and use cases' },
      { folder: 'features/*/presentation/', purpose: 'UI pages, widgets, and state management (BLoC/Cubit)' },
      { folder: 'lib/shared/', purpose: 'Shared widgets and extensions used across features' },
    ],
  },
  {
    id: 'fullstack-monorepo',
    name: 'Full Stack (Monorepo)',
    shortDesc: 'Turborepo/pnpm workspace with apps + packages',
    icon: '📦',
    tree: `my-monorepo/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   ├── config/
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── package.json
│   ├── types/
│   │   ├── src/
│   │   └── package.json
│   └── database/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── src/
│       └── package.json
├── infrastructure/
│   ├── docker/
│   │   └── Dockerfile
│   └── terraform/
├── docs/
│   └── architecture.md
├── scripts/
│   └── setup.sh
├── turbo.json
├── pnpm-workspace.yaml
└── package.json`,
    explanations: [
      { folder: 'apps/web/', purpose: 'Frontend application (Next.js, Remix, etc.)' },
      { folder: 'apps/api/', purpose: 'Backend API service' },
      { folder: 'packages/ui/', purpose: 'Shared component library consumed by apps' },
      { folder: 'packages/config/', purpose: 'Shared ESLint, TypeScript, and tooling configs' },
      { folder: 'packages/types/', purpose: 'Shared TypeScript types across the monorepo' },
      { folder: 'packages/database/', purpose: 'Database schema, migrations, and client' },
      { folder: 'infrastructure/', purpose: 'Docker, Terraform, and deployment configurations' },
      { folder: 'docs/', purpose: 'Project documentation and architecture decisions' },
      { folder: 'scripts/', purpose: 'Build, setup, and automation scripts' },
    ],
  },
  {
    id: 'django',
    name: 'Django',
    shortDesc: 'Python web framework with batteries included',
    icon: '🎸',
    tree: `my_django_project/
├── project/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── tests.py
│   └── core/
│       ├── __init__.py
│       ├── models.py
│       └── views.py
├── templates/
│   ├── base.html
│   └── components/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── media/
├── management/
│   └── commands/
│       └── seed_data.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── manage.py
└── pyproject.toml`,
    explanations: [
      { folder: 'project/', purpose: 'Django project settings, URL config, and WSGI/ASGI entry points' },
      { folder: 'apps/', purpose: 'Django apps with models, views, serializers, and tests' },
      { folder: 'templates/', purpose: 'HTML templates with base layout and reusable components' },
      { folder: 'static/', purpose: 'Static files (CSS, JS, images) collected for deployment' },
      { folder: 'media/', purpose: 'User-uploaded files (excluded from version control)' },
      { folder: 'management/commands/', purpose: 'Custom Django management commands (seeding, migrations, etc.)' },
    ],
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    shortDesc: 'Java enterprise backend with layered architecture',
    icon: '☕',
    tree: `my-spring-app/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── Application.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   └── UserController.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   └── UserService.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   ├── model/
│   │   │   │   └── User.java
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebConfig.java
│   │   │   ├── dto/
│   │   │   │   ├── UserRequest.java
│   │   │   │   └── UserResponse.java
│   │   │   └── exception/
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── ResourceNotFoundException.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── db/migration/
│   └── test/
│       └── java/com/example/app/
│           └── service/
│               └── UserServiceTest.java
├── pom.xml
└── README.md`,
    explanations: [
      { folder: 'controller/', purpose: 'REST controllers handling HTTP requests and responses' },
      { folder: 'service/', purpose: 'Business logic layer with service interfaces and implementations' },
      { folder: 'repository/', purpose: 'Data access layer using Spring Data JPA repositories' },
      { folder: 'model/', purpose: 'JPA entity classes mapping to database tables' },
      { folder: 'config/', purpose: 'Spring configuration classes (security, web, beans)' },
      { folder: 'dto/', purpose: 'Data Transfer Objects for request/response payloads' },
      { folder: 'exception/', purpose: 'Custom exceptions and global error handling' },
    ],
  },
];

/* ─── Helper: generate mkdir commands from a tree ─── */

function generateMkdirCommands(tree: string): string {
  const lines = tree.split('\n');
  const stack: string[] = [];
  const allDirs: Set<string> = new Set();

  for (const line of lines) {
    // Calculate depth based on indentation (each level is 4 chars of tree drawing)
    const depthMatch = line.match(/^([\s│├└─]*)/);
    const prefix = depthMatch ? depthMatch[1] : '';
    // Each tree level uses 4 characters (e.g., "│   " or "├── " or "└── ")
    const depth = Math.floor(prefix.length / 4);

    // Extract the name
    const name = line
      .replace(/[│├└─┬]/g, '')
      .replace(/^\s+/, '')
      .trim();

    if (!name) continue;

    // Trim stack to current depth
    stack.length = depth;
    stack.push(name.replace(/\/$/, ''));

    const fullPath = stack.join('/');

    // Determine if this is a directory
    const isDir = name.endsWith('/') || !name.includes('.');
    if (isDir) {
      allDirs.add(fullPath);
    } else {
      // Add parent directory of the file
      const parentPath = stack.slice(0, -1).join('/');
      if (parentPath) {
        allDirs.add(parentPath);
      }
    }
  }

  // Sort and only keep leaf directories (dirs that don't have children that are also dirs)
  const sortedDirs = Array.from(allDirs).sort();
  const leafDirs = sortedDirs.filter(
    (dir) => !sortedDirs.some((other) => other !== dir && other.startsWith(dir + '/'))
  );

  if (leafDirs.length === 0) return '# No directories to create';

  const rootName = leafDirs[0].split('/')[0];
  const command = `mkdir -p ${leafDirs.map((d) => `\\\n  ${d}`).join(' ')}`;

  return `# Create ${rootName} project structure\n${command}`;
}

/* ─── Component ─── */

export function ProjectStructureForm() {
  const [selectedPreset, setSelectedPreset] = useState<string>(presets[0].id);
  const [copiedTree, setCopiedTree] = useState(false);
  const [copiedMkdir, setCopiedMkdir] = useState(false);

  const currentPreset = presets.find((p) => p.id === selectedPreset) ?? presets[0];

  const copyToClipboard = useCallback(async (text: string, type: 'tree' | 'mkdir') => {
    trackToolUsage('project-structure-generator');
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'tree') {
        setCopiedTree(true);
        setTimeout(() => setCopiedTree(false), 2000);
      } else {
        setCopiedMkdir(true);
        setTimeout(() => setCopiedMkdir(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (type === 'tree') {
        setCopiedTree(true);
        setTimeout(() => setCopiedTree(false), 2000);
      } else {
        setCopiedMkdir(true);
        setTimeout(() => setCopiedMkdir(false), 2000);
      }
    }
  }, []);

  const mkdirCommands = generateMkdirCommands(currentPreset.tree);

  return (
    <div className="space-y-8">
      {/* Preset selector */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
          Select framework / architecture
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedPreset(preset.id)}
              className={`group relative p-4 text-left border rounded-sm transition-all ${
                selectedPreset === preset.id
                  ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)]/5 ring-1 ring-[var(--accent-dark)]/20'
                  : 'border-[var(--border-soft)] bg-[var(--bg-surface)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-lg leading-none" aria-hidden="true">
                  {preset.icon}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {preset.name}
                </span>
              </div>
              <p className="text-xs text-[var(--text-subtle)] line-clamp-2">
                {preset.shortDesc}
              </p>
              {selectedPreset === preset.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent-dark)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Output area */}
      <div className="border border-[var(--border-soft)] rounded-sm overflow-hidden bg-[var(--bg-surface)]">
        {/* Header with copy buttons */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-soft)] bg-[var(--bg-subtle)]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <FolderTree className="w-4 h-4 text-[var(--text-subtle)]" />
            <span>{currentPreset.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(currentPreset.tree, 'tree')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all"
            >
              {copiedTree ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Structure
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(mkdirCommands, 'mkdir')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-default)] transition-all"
            >
              {copiedMkdir ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5" />
                  Copy as mkdir
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tree output */}
        <div className="p-5 bg-[var(--bg-dark,#1a1a2e)] overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed text-[var(--text-on-dark,#e2e8f0)] whitespace-pre">
            {currentPreset.tree}
          </pre>
        </div>
      </div>

      {/* Folder explanations */}
      <div className="border border-[var(--border-soft)] rounded-sm p-5 md:p-6 bg-[var(--bg-surface)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">
          Folder purposes
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {currentPreset.explanations.map((item) => (
            <div key={item.folder} className="flex flex-col">
              <dt className="font-mono text-sm font-medium text-[var(--text-primary)]">
                {item.folder}
              </dt>
              <dd className="text-sm text-[var(--text-subtle)] mt-0.5">
                {item.purpose}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

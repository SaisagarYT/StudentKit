export interface ProjectPhase {
  id: string;
  phaseNumber: number;
  title: string;
  summary: string;
  estimatedDuration: string;
  imageUrl?: string;
  imageCaption?: string;
  content: string;
  objectives: string[];
  checkpointTasks: string[];
  expectedOutput?: string;
  githubBranchUrl?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectMilestone {
  title: string;
  description: string;
  tasks: string[];
}

export interface CuratedProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: 'Full-Stack' | 'Systems & Backend' | 'AI & Data' | 'DevOps & Cloud';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string;
  projectType: string;
  technologies: string[];
  skills: string[];
  featured: boolean;
  architecture: string;
  folderStructure: string;
  relatedRoadmapIds: string[];
  features: ProjectFeature[];
  milestones: ProjectMilestone[];
  phases?: ProjectPhase[];
}

export const curatedProjects: CuratedProject[] = [
  {
    id: 'fullstack-saas',
    slug: 'fullstack-saas',
    title: 'Full-Stack Multi-Tenant SaaS Platform',
    shortDescription: 'Build a production-ready subscription SaaS with multi-tenancy, authentication, role-based access, and Stripe billing.',
    description: 'A comprehensive full-stack enterprise web application designed to demonstrate mastery in modern frontend and backend architectures. Implements multi-tenant tenant isolation, server actions, optimistic UI updates, webhooks, and transactional emails.',
    category: 'Full-Stack',
    difficulty: 'intermediate',
    estimatedDuration: '3-4 Weeks',
    projectType: 'Web Application',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma ORM', 'Stripe API', 'NextAuth.js'],
    skills: ['Server-Side Rendering', 'Multi-Tenancy Architecture', 'Payment Webhooks', 'Database Migrations', 'RBAC Authorization'],
    featured: true,
    relatedRoadmapIds: ['full-stack-developer', 'frontend-developer', 'backend-developer'],
    architecture: `Client (Next.js 15 App Router / Server Components)
   │
   ▼
Edge Middleware (Session Verification & Tenant Subdomain Routing)
   │
   ▼
Application Tier (Next.js Server Actions & API Route Handlers)
   │
   ├── Stripe Webhooks ──► Billing Subscription Sync
   ├── Resend API      ──► Transactional Email Notification
   │
   ▼
Data Access Layer (Prisma ORM with Connection Pooling via PgBouncer)
   │
   ▼
PostgreSQL Database (Multi-tenant with tenant_id row-level security)`,
    folderStructure: `fullstack-saas/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/[tenant]/
│   │   │   ├── settings/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── page.tsx
│   │   ├── api/webhooks/stripe/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   └── stripe.ts
│   └── types/
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
└── package.json`,
    phases: [
  {
    "id": "phase-1-architecture-db",
    "phaseNumber": 1,
    "title": "Phase 1: Architecture, Multi-Tenant Modeling & Database Setup",
    "summary": "Scaffold the Next.js 15 full-stack repository, set up local containerized PostgreSQL and Redis via Docker Compose, and design a production-grade multi-tenant Prisma schema with Row-Level Security (RLS).",
    "estimatedDuration": "45 min read · 2.5 hrs build",
    "imageUrl": "/og/projects.png",
    "imageCaption": "Figure 1.1: Multi-Tenant Schema Architecture & Tenant Workspace Isolation Model",
    "objectives": [
      "Initialize Next.js 15 App Router & Tailwind CSS v4",
      "Configure Docker Compose for PostgreSQL 16 & Redis 7",
      "Design Multi-Tenant Prisma Schema (Workspaces, Members, Boards, Columns, Cards)",
      "Run Initial Database Migrations and Seed Test Tenant Data"
    ],
    "checkpointTasks": [
      "PostgreSQL container is running on port 5432 and Redis on 6379",
      "Prisma client is generated cleanly with npx prisma generate",
      "Database migration applied successfully with npx prisma migrate dev",
      "Seed script executes and creates initial test tenant and workspace"
    ],
    "expectedOutput": "Environment variables loaded from .env\nPrisma schema loaded from prisma/schema.prisma\nDatasource \"db\": PostgreSQL database \"kanban_saas\" at \"localhost:5432\"\n\nApplying migration `20260916_init_multitenant_schema`\n\nThe following migration(s) have been applied:\n- 20260916_init_multitenant_schema\n\nYour database is now in sync with your schema.\n✔ Generated Prisma Client (v5.19.0) to ./node_modules/@prisma/client in 78ms",
    "content": "### Architectural Overview\n\nIn a multi-tenant B2B SaaS platform, data isolation between organizations is the single most critical architectural concern. There are three primary multi-tenancy models:\n\n1. **Database-per-tenant:** Highest isolation, but expensive to operate and difficult to manage migrations across thousands of tenants.\n2. **Schema-per-tenant:** Separate PostgreSQL schemas inside a single database. Good balance, but connection pooling can become complex.\n3. **Shared database with Row-Level Security (RLS) and Tenant ID columns:** Industry standard used by platforms like Slack, Linear, and Supabase. Every table has an `organizationId` column, and database queries are strictly scoped by tenant.\n\nFor this project, we will use **Option 3 (Shared database with Tenant ID)**, which allows us to maintain a single Prisma schema and leverage connection pooling efficiently.\n\n---\n\n### Step 1: Environment & Container Setup\n\nCreate a `docker-compose.yml` file in your project root to run PostgreSQL and Redis locally:\n\n```yaml\n# docker-compose.yml\nversion: '3.8'\n\nservices:\n  postgres:\n    image: postgres:16-alpine\n    container_name: kanban_postgres\n    restart: always\n    environment:\n      POSTGRES_USER: postgres\n      POSTGRES_PASSWORD: postgrespassword\n      POSTGRES_DB: kanban_saas\n    ports:\n      - '5432:5432'\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n    container_name: kanban_redis\n    restart: always\n    ports:\n      - '6379:6379'\n    volumes:\n      - redis_data:/data\n\nvolumes:\n  postgres_data:\n  redis_data:\n```\n\nStart the containers by executing:\n```bash\ndocker compose up -d\n```\n\n---\n\n### Step 2: The Multi-Tenant Prisma Schema\n\nCreate your schema definition in `prisma/schema.prisma`. Note the relationships between `Organization`, `Membership`, `Board`, `Column`, and `Card`:\n\n```prisma\n// prisma/schema.prisma\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\nenum Role {\n  OWNER\n  ADMIN\n  MEMBER\n  GUEST\n}\n\nmodel User {\n  id            String       @id @default(cuid())\n  name          String?\n  email         String       @unique\n  image         String?\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n  memberships   Membership[]\n  assignedCards Card[]       @relation(\"CardAssignee\")\n}\n\nmodel Organization {\n  id          String       @id @default(cuid())\n  name        String\n  slug        String       @unique\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  memberships Membership[]\n  boards      Board[]\n}\n\nmodel Membership {\n  id             String       @id @default(cuid())\n  role           Role         @default(MEMBER)\n  userId         String\n  organizationId String\n  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  createdAt      DateTime     @default(now())\n\n  @@unique([userId, organizationId])\n  @@index([organizationId])\n}\n\nmodel Board {\n  id             String       @id @default(cuid())\n  title          String\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  columns        Column[]\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n\n  @@index([organizationId])\n}\n\nmodel Column {\n  id        String   @id @default(cuid())\n  title     String\n  order     Int\n  boardId   String\n  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)\n  cards     Card[]\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([boardId])\n}\n\nmodel Card {\n  id          String   @id @default(cuid())\n  title       String\n  description String?  @db.Text\n  order       Float    // Fractional index for zero-shift reordering\n  columnId    String\n  column      Column   @relation(fields: [columnId], references: [id], onDelete: Cascade)\n  assigneeId  String?\n  assignee    User?    @relation(\"CardAssignee\", fields: [assigneeId], references: [id], onDelete: SetNull)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  @@index([columnId])\n}\n```\n\n> **Engineering Tip (Fractional Indexing):**  \n> Notice that `Card.order` is defined as a `Float` rather than an `Int`. When dragging a card between two existing cards with orders `1000` and `2000`, the new order is simply `(1000 + 2000) / 2 = 1500`. This allows O(1) single-row position updates without shifting all subsequent cards in the column!\n\n---\n\n### Step 3: Database Connection Singleton\n\nTo prevent exhausting database connections during Next.js Hot Module Replacement (HMR), establish a singleton in `src/lib/db.ts`:\n\n```typescript\n// src/lib/db.ts\nimport { PrismaClient } from '@prisma/client';\n\nconst globalForPrisma = globalThis as unknown as {\n  prisma: PrismaClient | undefined;\n};\n\nexport const db =\n  globalForPrisma.prisma ??\n  new PrismaClient({\n    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],\n  });\n\nif (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;\n```\n\nRun the initial migration:\n```bash\nnpx prisma migrate dev --name init_multitenant_schema\n```\n"
  },
  {
    "id": "phase-2-auth-apis",
    "phaseNumber": 2,
    "title": "Phase 2: Authentication, Subdomain Middleware & REST APIs",
    "summary": "Build tenant-aware session authentication with JWT token rotation, configure Next.js Edge Middleware for organization subdomain routing, and implement atomic CRUD APIs for Kanban columns and cards.",
    "estimatedDuration": "50 min read · 3 hrs build",
    "imageUrl": "/og/projects.png",
    "imageCaption": "Figure 2.1: Edge Middleware Request Resolution & Subdomain Routing Flow",
    "objectives": [
      "Configure NextAuth session handling and organization context",
      "Implement Edge Middleware for tenant subdomain isolation",
      "Create Zod validation schemas for Card creation and column reordering",
      "Implement atomic REST Route Handlers for Kanban operations"
    ],
    "checkpointTasks": [
      "Edge middleware correctly extracts tenant slug from hostname or URL path",
      "POST /api/cards creates card with automatic fractional order calculation",
      "PATCH /api/cards/reorder updates card column and position atomically",
      "Unauthorized requests without valid membership are rejected with 403 Forbidden"
    ],
    "expectedOutput": "$ curl -X POST http://localhost:3000/api/workspaces/acme/cards \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"title\":\"Implement Redis PubSub\",\"columnId\":\"col_todo_1\"}'\n\n{\"success\":true,\"card\":{\"id\":\"c_98fbc1\",\"title\":\"Implement Redis PubSub\",\"columnId\":\"col_todo_1\",\"order\":1024,\"createdAt\":\"2026-09-16T10:00:00.000Z\"}}",
    "content": "### Subdomain & Path Resolution via Edge Middleware\n\nIn modern multi-tenant platforms, users access their workspace via `acme.yourdomain.com` or `yourdomain.com/acme`. We handle this at the edge before any route handler executes.\n\nCreate `src/middleware.ts`:\n\n```typescript\n// src/middleware.ts\nimport { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport function middleware(req: NextRequest) {\n  const url = req.nextUrl;\n  const hostname = req.headers.get('host') || '';\n\n  // Define allowed root domains (localhost, production domain)\n  const currentHost = hostname.replace(`:${process.env.PORT || 3000}`, '');\n  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';\n\n  // Extract subdomain: e.g. \"acme.localhost\" -> \"acme\"\n  const isSubdomain = currentHost.endsWith(`.${rootDomain}`);\n  const tenantSlug = isSubdomain\n    ? currentHost.replace(`.${rootDomain}`, '')\n    : null;\n\n  // Pass tenant slug to downstream server components via custom request header\n  const requestHeaders = new Headers(req.headers);\n  if (tenantSlug) {\n    requestHeaders.set('x-tenant-slug', tenantSlug);\n  }\n\n  return NextResponse.next({\n    request: {\n      headers: requestHeaders,\n    },\n  });\n}\n\nexport const config = {\n  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],\n};\n```\n\n---\n\n### Step 2: Zod Validation Schemas for Atomic Mutations\n\nCreate `src/lib/schemas/kanban.ts` to guarantee strict runtime validation on all mutations:\n\n```typescript\n// src/lib/schemas/kanban.ts\nimport { z } from 'zod';\n\nexport const CreateCardSchema = z.object({\n  title: z.string().min(1, 'Card title is required').max(120),\n  description: z.string().optional(),\n  columnId: z.string().min(1),\n});\n\nexport const MoveCardSchema = z.object({\n  cardId: z.string().min(1),\n  targetColumnId: z.string().min(1),\n  newOrder: z.number().positive(),\n});\n\nexport type CreateCardInput = z.infer<typeof CreateCardSchema>;\nexport type MoveCardInput = z.infer<typeof MoveCardSchema>;\n```\n\n---\n\n### Step 3: Card Mutation Route Handlers\n\nCreate the API route handler in `src/app/api/cards/route.ts`:\n\n```typescript\n// src/app/api/cards/route.ts\nimport { NextResponse } from 'next/server';\nimport { db } from '@/lib/db';\nimport { CreateCardSchema } from '@/lib/schemas/kanban';\n\nexport async function POST(req: Request) {\n  try {\n    const body = await req.json();\n    const result = CreateCardSchema.safeParse(body);\n\n    if (!result.success) {\n      return NextResponse.json(\n        { error: 'Invalid input', details: result.error.format() },\n        { status: 400 }\n      );\n    }\n\n    const { title, description, columnId } = result.data;\n\n    // Find highest order in current column to place card at bottom\n    const lastCard = await db.card.findFirst({\n      where: { columnId },\n      orderBy: { order: 'desc' },\n      select: { order: true },\n    });\n\n    const newOrder = lastCard ? lastCard.order + 1000 : 1000;\n\n    const card = await db.card.create({\n      data: {\n        title,\n        description,\n        columnId,\n        order: newOrder,\n      },\n    });\n\n    return NextResponse.json({ success: true, card });\n  } catch (error) {\n    console.error('[API Cards POST]', error);\n    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });\n  }\n}\n```\n"
  },
  {
    "id": "phase-3-websockets-redis",
    "phaseNumber": 3,
    "title": "Phase 3: Real-Time Sync Engine with WebSockets & Redis",
    "summary": "Implement a standalone WebSocket server integrated with Redis Pub/Sub for horizontal scaling, allowing multiple collaborators to see instant card movement and live user presence cursors without polling.",
    "estimatedDuration": "60 min read · 3.5 hrs build",
    "imageUrl": "/og/projects.png",
    "imageCaption": "Figure 3.1: Distributed WebSocket Architecture with Redis Pub/Sub Adapter",
    "objectives": [
      "Build standalone Node.js WebSocket server using ws library",
      "Connect Redis Pub/Sub publisher and subscriber channels",
      "Define event payloads (CARD_MOVED, USER_PRESENCE, USER_JOINED)",
      "Implement client-side useKanbanSocket React hook with exponential backoff"
    ],
    "checkpointTasks": [
      "WebSocket connection establishes successfully on ws://localhost:3001",
      "Dragging a card in Window A immediately updates position in Window B (< 50ms)",
      "Cursor movements broadcast real-time X/Y coordinates across users in room",
      "Disconnecting automatically cleans up user avatar from active presence strip"
    ],
    "expectedOutput": "[WebSocket Server] Server listening on port 3001\n[Redis Pub/Sub] Connected to redis://localhost:6379\n[Client Connected] Session user_usr789 joined room workspace:acme\n[Broadcast Event] CARD_MOVED { cardId: 'c_98fbc1', targetColumn: 'col_done_1' } to 2 active sockets",
    "content": "### Why HTTP Polling Fails for Real-Time Kanban\n\nShort polling makes requests every 2 seconds, creating immense server overhead and database query contention. Long polling is better but holds connections open needlessly.\n\nWebSockets establish a persistent, full-duplex TCP connection. When paired with **Redis Pub/Sub**, our WebSocket servers can scale horizontally:\n- User A connects to WebSocket Server 1.\n- User B connects to WebSocket Server 2.\n- When User A moves a card, Server 1 publishes the event to Redis: `PUBLISH board:acme CARD_MOVED`.\n- Server 2 receives the Redis event and forwards it down the open socket to User B!\n\n---\n\n### Step 1: Standalone WebSocket Server with Redis\n\nCreate `server/websocket.ts`:\n\n```typescript\n// server/websocket.ts\nimport { WebSocketServer, WebSocket } from 'ws';\nimport Redis from 'ioredis';\n\nconst PORT = 3001;\nconst wss = new WebSocketServer({ port: PORT });\nconst pub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');\nconst sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');\n\ninterface ClientMeta {\n  ws: WebSocket;\n  userId: string;\n  boardId: string;\n}\n\nconst clients = new Map<WebSocket, ClientMeta>();\n\n// Subscribe to global kanban events channel\nsub.subscribe('kanban_events', (err) => {\n  if (err) console.error('[Redis Sub Error]', err);\n  else console.log('[Redis Pub/Sub] Subscribed to kanban_events');\n});\n\n// Broadcast Redis events to all local matching sockets\nsub.on('message', (_channel, message) => {\n  const event = JSON.parse(message);\n  for (const [ws, meta] of clients.entries()) {\n    if (meta.boardId === event.boardId && ws.readyState === WebSocket.OPEN) {\n      ws.send(message);\n    }\n  }\n});\n\nwss.on('connection', (ws) => {\n  console.log('[WebSocket] Client connected');\n\n  ws.on('message', (raw) => {\n    try {\n      const data = JSON.parse(raw.toString());\n\n      if (data.type === 'JOIN_BOARD') {\n        clients.set(ws, { ws, userId: data.userId, boardId: data.boardId });\n        console.log(`[User Joined] ${data.userId} -> Board ${data.boardId}`);\n      }\n\n      if (data.type === 'CARD_MOVED') {\n        // Publish to Redis so all worker nodes receive it\n        pub.publish('kanban_events', JSON.stringify(data));\n      }\n    } catch (e) {\n      console.error('[WS Message Error]', e);\n    }\n  });\n\n  ws.on('close', () => {\n    clients.delete(ws);\n  });\n});\n\nconsole.log(`[WebSocket Server] Running on port ${PORT}`);\n```\n\n---\n\n### Step 2: Client-Side React Hook (`useKanbanSocket`)\n\nCreate `src/hooks/use-kanban-socket.ts`:\n\n```typescript\n// src/hooks/use-kanban-socket.ts\nimport { useEffect, useRef, useState } from 'react';\n\nexport function useKanbanSocket(boardId: string, userId: string) {\n  const socketRef = useRef<WebSocket | null>(null);\n  const [isConnected, setIsConnected] = useState(false);\n\n  useEffect(() => {\n    const ws = new WebSocket('ws://localhost:3001');\n    socketRef.current = ws;\n\n    ws.onopen = () => {\n      setIsConnected(true);\n      ws.send(JSON.stringify({ type: 'JOIN_BOARD', boardId, userId }));\n    };\n\n    ws.onclose = () => {\n      setIsConnected(false);\n    };\n\n    return () => {\n      ws.close();\n    };\n  }, [boardId, userId]);\n\n  function broadcastCardMove(cardId: string, targetColumnId: string, newOrder: number) {\n    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {\n      socketRef.current.send(JSON.stringify({\n        type: 'CARD_MOVED',\n        boardId,\n        cardId,\n        targetColumnId,\n        newOrder,\n      }));\n    }\n  }\n\n  return { isConnected, broadcastCardMove };\n}\n```\n"
  },
  {
    "id": "phase-4-docker-deployment",
    "phaseNumber": 4,
    "title": "Phase 4: Production Dockerization, Nginx & CI/CD Pipeline",
    "summary": "Containerize the application using production multi-stage Docker builds, configure Nginx to reverse proxy HTTP and WebSocket traffic with SSL, and automate testing via GitHub Actions.",
    "estimatedDuration": "40 min read · 2 hrs build",
    "imageUrl": "/og/projects.png",
    "imageCaption": "Figure 4.1: Multi-Stage Docker Pipeline and Nginx Reverse Proxy Topography",
    "objectives": [
      "Write optimized multi-stage Dockerfile (< 180MB image size)",
      "Configure Nginx reverse proxy with WebSocket Upgrade headers",
      "Create automated GitHub Actions workflow for typecheck & linting",
      "Verify production startup with Docker Compose"
    ],
    "checkpointTasks": [
      "Multi-stage Docker build finishes cleanly without development dependencies",
      "Nginx proxies both HTTP REST endpoints and WebSocket ws:// connections",
      "GitHub Actions workflow runs green on pull requests",
      "Ready to add to your developer portfolio and ATS resume"
    ],
    "expectedOutput": "[+] Building 42.1s (18/18) FINISHED\n => [internal] load build definition from Dockerfile\n => => naming to docker.io/studentkit/kanban-saas:latest\n => exporting to image\nSize: 168.4MB (stripped non-production dependencies)\n\n$ docker compose -f docker-compose.prod.yml up -d\n[+] Running 4/4\n ✔ Network kanban_prod_network      Created\n ✔ Container kanban_postgres_prod   Started\n ✔ Container kanban_redis_prod      Started\n ✔ Container kanban_app_prod        Started",
    "content": "### Production Multi-Stage Dockerfile\n\nA production image should be lightweight, fast to boot, and free of dev tooling or source maps. We use a 3-stage build:\n1. **deps:** Cache npm modules.\n2. **builder:** Compile Next.js bundle and Prisma client.\n3. **runner:** Ultra-slim Alpine node image running with non-root security privileges.\n\n```dockerfile\n# Dockerfile\nFROM node:20-alpine AS base\n\n# 1. Install dependencies only when needed\nFROM base AS deps\nRUN apk add --no-cache libc6-compat\nWORKDIR /app\nCOPY package.json package-lock.json* ./\nRUN npm ci\n\n# 2. Rebuild the source code only when needed\nFROM base AS builder\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npx prisma generate\nRUN npm run build\n\n# 3. Production image, copy all the files and run next\nFROM base AS runner\nWORKDIR /app\nENV NODE_ENV production\nRUN addgroup --system --gid 1001 nodejs\nRUN adduser --system --uid 1001 nextjs\n\nCOPY --from=builder /app/public ./public\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static\n\nUSER nextjs\nEXPOSE 3000\nENV PORT 3000\n\nCMD [\"node\", \"server.js\"]\n```\n\n---\n\n### Step 2: Nginx Reverse Proxy Configuration\n\nNginx routes standard HTTP requests to port 3000 and WebSocket upgrade requests to port 3001:\n\n```nginx\n# /etc/nginx/conf.d/kanban.conf\nserver {\n    listen 80;\n    server_name app.yourdomain.com;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n\n    location /ws {\n        proxy_pass http://localhost:3001;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection \"Upgrade\";\n        proxy_set_header Host $host;\n    }\n}\n```\n\n---\n\n### Step 3: GitHub Actions CI Pipeline\n\nCreate `.github/workflows/ci.yml`:\n\n```yaml\nname: CI Pipeline\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'npm'\n      - run: npm ci\n      - run: npx prisma generate\n      - run: npm run typecheck\n      - run: npm run lint\n      - run: npm run build\n```\n\n---\n\n### 🎉 Congratulations! Project Complete\n\nYou have built an enterprise-grade, multi-tenant real-time collaborative SaaS platform from scratch. Click the button below to add this project directly to your **ATS Resume Builder** with pre-formatted bullet points!\n"
  }
],
    features: [
      {
        title: 'Multi-Tenant Organization Workspaces',
        description: 'Organization switching with isolated member lists, team invitations, and role-based permissions (Owner, Admin, Member).',
      },
      {
        title: 'Stripe Checkout & Customer Portal',
        description: 'Metered or tiered subscription billing, invoice history, automatic webhook handling for payment failures and upgrades.',
      },
      {
        title: 'Optimistic UI & Server Actions',
        description: 'Instant client-side feedback with React 19 optimistic hooks backed by atomic server mutations.',
      },
      {
        title: 'Audit Logs & Activity Feed',
        description: 'Searchable event audit logging capturing administrative operations with actor metadata.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: Architecture & Data Modeling',
        description: 'Initialize repository, establish schema migrations, and wire up database relationships.',
        tasks: [
          'Design Prisma schema with User, Organization, Membership, Subscription, and AuditLog models',
          'Configure PostgreSQL locally with Docker and set up connection pooling',
          'Implement session management using NextAuth or Supabase Auth',
        ],
      },
      {
        title: 'Stage 2: Authentication & Workspace Context',
        description: 'Build user sign-up, sign-in, and active organization context switching.',
        tasks: [
          'Implement email/password and OAuth sign-in flows',
          'Create organization onboarding workflow for first-time tenants',
          'Build middleware to resolve current tenant from URL path or subdomain',
        ],
      },
      {
        title: 'Stage 3: Core Workspace Dashboard',
        description: 'Develop the core workspace features and CRUD operations for business assets.',
        tasks: [
          'Construct responsive sidebar navigation and workspace switching dropdown',
          'Build primary dashboard metric cards and activity feed',
          'Add team member invite flow with secure email invitation tokens',
        ],
      },
      {
        title: 'Stage 4: Stripe Billing & Webhook Engine',
        description: 'Integrate subscription billing lifecycle and handle asynchronous webhook events.',
        tasks: [
          'Configure Stripe Checkout session creation for monthly/annual plans',
          'Implement raw webhook signature verification endpoint',
          'Handle customer.subscription.created, updated, and deleted events to sync DB status',
        ],
      },
      {
        title: 'Stage 5: Production Deployment & Observability',
        description: 'Deploy the application to Vercel/Railway with production-grade monitoring.',
        tasks: [
          'Setup environment variables, secrets management, and SSL certs',
          'Configure automated DB migration step in CI/CD pipeline',
          'Add structured error logging and health check endpoints',
        ],
      },
    ],
  },
  {
    id: 'realtime-collaborative-canvas',
    slug: 'realtime-collaborative-canvas',
    title: 'Real-Time Collaborative Canvas & Code Editor',
    shortDescription: 'Build a multi-user collaborative workspace with live cursors, CRDT sync, WebSockets, and code execution.',
    description: 'An interactive multi-user collaborative development platform featuring real-time state synchronization via Conflict-Free Replicated Data Types (CRDTs), live multi-user cursors, and containerized code execution sandboxes.',
    category: 'Full-Stack',
    difficulty: 'advanced',
    estimatedDuration: '4-5 Weeks',
    projectType: 'Collaborative Workspace',
    technologies: ['React', 'TypeScript', 'WebSockets', 'Yjs (CRDT)', 'Node.js', 'Redis Pub/Sub', 'Monaco Editor'],
    skills: ['CRDT Synchronization', 'WebSocket Lifecycle', 'Distributed State', 'Canvas 2D Rendering', 'Redis Pub/Sub'],
    featured: true,
    relatedRoadmapIds: ['frontend-developer', 'full-stack-developer', 'backend-developer'],
    architecture: `Client 1 ──┐
Client 2 ──┼──► WebSocket (wss://) ──► Node.js Gateway Cluster
Client N ──┘                                │
                                            ▼
                              Redis Pub/Sub Event Bus
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    CRDT Document Provider (Y-Sweet / Yjs)                   Code Execution Worker
               │                                                         │
               ▼                                                         ▼
      PostgreSQL Document Store                                 Docker Isolated Sandbox`,
    folderStructure: `collab-workspace/
├── apps/
│   ├── web/
│   │   ├── src/components/canvas/
│   │   ├── src/components/editor/
│   │   └── src/hooks/use-collaboration.ts
│   └── ws-server/
│       ├── src/rooms/
│       ├── src/crdt/
│       └── src/index.ts
├── packages/
│   └── shared-types/
├── docker-compose.yml
└── package.json`,
    features: [
      {
        title: 'Multi-User Live Cursors',
        description: 'Smooth 60fps cursor tracking with username tags, user colors, and presence heartbeat detection.',
      },
      {
        title: 'CRDT-Driven Canvas & Document Sync',
        description: 'Conflict-free shared drawing canvas and rich code editor using Yjs algorithms with zero data loss.',
      },
      {
        title: 'Room-Based Access & Ephemeral Sessions',
        description: 'Instant room generation, invite links, participant permission toggles (Viewer vs. Editor).',
      },
      {
        title: 'Sandboxed Code Runner',
        description: 'Execute JavaScript/Python snippets in real time and broadcast execution outputs to all connected peers.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: WebSocket Infrastructure',
        description: 'Build the foundational WebSocket gateway server with heartbeats and room connection handling.',
        tasks: [
          'Create WebSocket server with connection authentication and room multiplexing',
          'Implement client connection reconnection logic with exponential backoff',
          'Add Redis Pub/Sub adapter to support horizontal scaling across server nodes',
        ],
      },
      {
        title: 'Stage 2: Awareness & Live Cursors',
        description: 'Transmit ephemeral presence data including cursor positions and selection states.',
        tasks: [
          'Transmit normalized (x,y) screen coordinates throttled to 30ms intervals',
          'Interpolate cursor motion on receiving clients for buttery smooth rendering',
          'Handle user disconnects and cursor cleanup gracefully',
        ],
      },
      {
        title: 'Stage 3: CRDT State Synchronization',
        description: 'Integrate Yjs shared state across the canvas elements and Monaco code editor.',
        tasks: [
          'Set up Y.Doc with shared Array and Map structures for shapes and text',
          'Bind Monaco Editor to Yjs Monaco Binding for simultaneous code typing',
          'Implement snapshot persistence to database periodically',
        ],
      },
      {
        title: 'Stage 4: Collaborative Infinite Canvas',
        description: 'Build zoom, pan, rectangle, arrow, and text rendering on HTML5 Canvas or SVG.',
        tasks: [
          'Implement viewport transform matrix for infinite canvas panning and zooming',
          'Add shape selection, dragging, and resize bounding boxes',
          'Sync object mutation events across active collaborators',
        ],
      },
      {
        title: 'Stage 5: Production Hardening & Benchmarking',
        description: 'Stress-test concurrent client connections and optimize bundle payload.',
        tasks: [
          'Run load tests simulating 100+ concurrent clients in a single room',
          'Measure and minimize WebSocket frame serialization overhead',
          'Deploy WebSocket cluster on Railway or AWS ECS with sticky sessions',
        ],
      },
    ],
  },
  {
    id: 'ai-resume-analyzer',
    slug: 'ai-resume-analyzer',
    title: 'AI Resume Analyzer & ATS Score Optimizer',
    shortDescription: 'Build an intelligent resume analysis platform that parses PDFs, matches job descriptions, and provides ATS feedback.',
    description: 'An AI-powered career tool that extracts structured text from student resumes (PDF/DOCX), evaluates syntax, metrics, and formatting against target job descriptions, and calculates deterministic ATS match scores.',
    category: 'AI & Data',
    difficulty: 'intermediate',
    estimatedDuration: '2-3 Weeks',
    projectType: 'AI Tool & Web App',
    technologies: ['Next.js 15', 'TypeScript', 'Python', 'FastAPI', 'Gemini / OpenAI API', 'pdf-parse', 'Tailwind CSS'],
    skills: ['PDF Text Extraction', 'Prompt Engineering', 'Structured JSON Schema Extraction', 'Cosine Similarity', 'Vector Embeddings'],
    featured: true,
    relatedRoadmapIds: ['frontend-developer', 'full-stack-developer', 'ai-engineer'],
    architecture: `Client (Next.js File Upload UI)
   │
   ▼
FastAPI Processing Service (Python)
   │
   ├── pdf-parse / pdfplumber ──► Clean Text & Section Extraction
   │
   ├── SentenceTransformers   ──► Compute Embedding of Resume & Job Spec
   │                              │
   │                              ▼
   │                         Cosine Similarity Keyword Match
   │
   ▼
LLM Orchestrator (Structured JSON Schema via Gemini / Claude API)
   │
   ▼
Response (ATS Score, Actionable Fixes, Missing Keywords, Bullet Re-writes)`,
    folderStructure: `ai-resume-optimizer/
├── web/
│   ├── src/app/analyze/page.tsx
│   ├── src/components/ats-radar.tsx
│   └── src/components/diff-viewer.tsx
├── api/
│   ├── app/
│   │   ├── parser.py
│   │   ├── scorer.py
│   │   └── main.py
│   └── requirements.txt
└── README.md`,
    features: [
      {
        title: 'Deterministic ATS Scorecard',
        description: 'Calculates objective scores across Impact Metrics, Section Structure, Keyword Density, and Brevity.',
      },
      {
        title: 'Job Description Matcher',
        description: 'Compares resume content against any pasted job description, highlighting missing tech keywords.',
      },
      {
        title: 'AI Bullet Point Rewriter',
        description: 'Transforms weak task descriptions into high-impact XYZ achievement statements (Accomplished X by doing Y measured by Z).',
      },
      {
        title: 'Live Side-by-Side PDF Viewer',
        description: 'Highlights problematic areas directly on the uploaded document with actionable fix cards.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: Document Ingestion Pipeline',
        description: 'Build drag-and-drop PDF upload and extraction engine.',
        tasks: [
          'Implement client-side drag-and-drop file upload with format validation',
          'Extract structured text, headers, and contact information from PDF bytes',
          'Detect formatting anti-patterns (tables, two-column layouts, graphics)',
        ],
      },
      {
        title: 'Stage 2: Heuristic Analysis Engine',
        description: 'Implement deterministic rules for resume length, action verbs, and quantifiable metrics.',
        tasks: [
          'Create regex scanners for metrics ($ amounts, % gains, speedups)',
          'Verify core standard sections: Contact, Education, Experience, Projects, Skills',
          'Compute readability score and brevity ratio',
        ],
      },
      {
        title: 'Stage 3: LLM Integration with Strict JSON Schemas',
        description: 'Configure prompt templates that return structured suggestions with zero hallucination.',
        tasks: [
          'Define Zod / Pydantic schema for evaluation output',
          'Feed extracted sections to LLM with structured output constraints',
          'Implement fallback caching to avoid redundant API calls for identical documents',
        ],
      },
      {
        title: 'Stage 4: Interactive UI & Diff Preview',
        description: 'Present the findings with interactive visual meters and before/after comparisons.',
        tasks: [
          'Build score radar and category breakdown cards',
          'Create one-click copy cards for optimized bullet points',
          'Allow students to export PDF analysis reports',
        ],
      },
    ],
  },
  {
    id: 'distributed-rate-limiter',
    slug: 'distributed-rate-limiter',
    title: 'High-Throughput Distributed Rate Limiter & API Gateway',
    shortDescription: 'Build an ultra-low latency distributed rate-limiting reverse proxy using Go, Redis, and Token Bucket algorithms.',
    description: 'A production-grade distributed rate limiter and API reverse proxy engineered in Go. Implements Token Bucket and Sliding Window Counter algorithms with Redis Lua scripts to guarantee sub-millisecond atomic evaluations under heavy concurrent loads.',
    category: 'Systems & Backend',
    difficulty: 'advanced',
    estimatedDuration: '3 Weeks',
    projectType: 'System Software',
    technologies: ['Go (Golang)', 'Redis', 'Docker', 'Prometheus', 'Grafana', 'HTTP Reverse Proxy'],
    skills: ['Concurrency in Go', 'Lua Scripting in Redis', 'Token Bucket Algorithm', 'Sliding Window Rate Limiting', 'Prometheus Metrics'],
    featured: false,
    relatedRoadmapIds: ['backend-developer', 'devops'],
    architecture: `Incoming HTTP Traffic (10,000 req/sec)
   │
   ▼
Go Rate Limiter Gateway (:8080)
   │
   ├── 1. Client Identifier Extraction (API Key / IP / User-ID)
   ├── 2. Execute Atomic Redis Lua Script (Sliding Window Log / Token Bucket)
   │
   ├── [If Exceeded] ──► Return 429 Too Many Requests + Retry-After Header
   │
   └── [If Allowed]  ──► Forward request to Upstream Services (:3000, :4000)
   │
   ▼
Prometheus Metrics Exporter (:9090) ──► Grafana Dashboard`,
    folderStructure: `rate-limiter-gateway/
├── cmd/
│   └── gateway/main.go
├── internal/
│   ├── limiter/
│   │   ├── token_bucket.go
│   │   ├── sliding_window.go
│   │   └── redis.lua
│   ├── proxy/
│   │   └── reverse_proxy.go
│   └── metrics/
│       └── prometheus.go
├── configs/gateway.yaml
├── docker-compose.yml
├── Dockerfile
└── go.mod`,
    features: [
      {
        title: 'Atomic Redis Lua Scripting',
        description: 'Zero race conditions during check-and-decrement cycles by executing scripts atomically inside Redis memory.',
      },
      {
        title: 'Multi-Algorithm Support',
        description: 'Configurable algorithms: Token Bucket for burst allowance, or Sliding Window Counter for strict SLA compliance.',
      },
      {
        title: 'Standard RFC Rate-Limit Headers',
        description: 'Populates X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After response headers accurately.',
      },
      {
        title: 'Real-Time Observability Stack',
        description: 'Prometheus metrics capturing allowed requests, throttled requests, and p99 Redis evaluation latencies.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: Core Algorithm Implementation',
        description: 'Implement Token Bucket and Sliding Window algorithms in memory and benchmark them.',
        tasks: [
          'Write Token Bucket with refill rate and burst capacity in pure Go',
          'Write unit tests verifying edge cases and boundary limits',
          'Run Go benchmarks to verify microsecond throughput',
        ],
      },
      {
        title: 'Stage 2: Distributed State with Redis Lua',
        description: 'Port algorithm logic to atomic Redis Lua scripts to support multi-instance deployments.',
        tasks: [
          'Implement Token Bucket Lua script using Redis hash keys and TTLs',
          'Implement Sliding Window Counter Lua script using Redis sorted sets (ZADD/ZREMRANGEBYSCORE)',
          'Validate atomic script execution under concurrent goroutine stress tests',
        ],
      },
      {
        title: 'Stage 3: Reverse Proxy Middleware',
        description: 'Wrap the limiter into an HTTP reverse proxy that inspects headers and routes upstream.',
        tasks: [
          'Build configurable reverse proxy forwarding to upstream microservices',
          'Add API key authorization and tier-based rate limit rules (e.g. Free: 60/min, Pro: 1000/min)',
          'Return standard 429 response bodies with RFC headers',
        ],
      },
      {
        title: 'Stage 4: Load Testing & Grafana Monitoring',
        description: 'Expose Prometheus metrics and benchmark with k6 / hey under 10k req/sec load.',
        tasks: [
          'Instrument Prometheus counters and histogram gauges for request duration',
          'Spin up Grafana dashboard visualizing live throughput and throttle rate',
          'Benchmark with k6 to demonstrate sub-millisecond p99 latency',
        ],
      },
    ],
  },
  {
    id: 'ecommerce-microservices',
    slug: 'ecommerce-microservices',
    title: 'Event-Driven E-Commerce Microservices Engine',
    shortDescription: 'Build an asynchronous order and inventory management system powered by Kafka event streams and PostgreSQL.',
    description: 'An enterprise event-driven architecture featuring isolated microservices for Catalog, Orders, Inventory, and Notifications. Uses Apache Kafka for reliable asynchronous message passing and the Saga pattern for distributed transactions.',
    category: 'Systems & Backend',
    difficulty: 'advanced',
    estimatedDuration: '4 Weeks',
    projectType: 'Enterprise Architecture',
    technologies: ['Node.js / Go', 'Apache Kafka', 'PostgreSQL', 'Docker Compose', 'Redis', 'Prisma / SQL'],
    skills: ['Event-Driven Architecture', 'Kafka Message Queues', 'Saga Pattern', 'Idempotency', 'Distributed Transactions'],
    featured: false,
    relatedRoadmapIds: ['backend-developer', 'devops'],
    architecture: `Client (Checkout Request)
   │
   ▼
Order Service ──► Saves Order (PENDING)
   │
   ▼ Emits event: "order_created"
[ Kafka Topic: order-events ]
   │
   ├──► Inventory Service: Reserves Stock ──► Emits: "inventory_reserved"
   ├──► Payment Service:   Charges Card   ──► Emits: "payment_settled"
   │
   ▼ If payment fails
Compensating Transaction (Saga) ──► Reverts Stock in Inventory Service
   │
   ▼ If success
Notification Service ──► Dispatches Order Confirmation Email via Worker`,
    folderStructure: `ecommerce-microservices/
├── services/
│   ├── order-service/
│   ├── inventory-service/
│   ├── payment-service/
│   └── notification-service/
├── packages/
│   └── event-contracts/
├── docker-compose.yml
└── README.md`,
    features: [
      {
        title: 'Choreographed Saga Pattern',
        description: 'Maintains transactional consistency across distributed services without two-phase locking.',
      },
      {
        title: 'Idempotent Consumer Handlers',
        description: 'Ensures duplicate Kafka messages are ignored without corrupting inventory or double-charging.',
      },
      {
        title: 'Dead-Letter Queue (DLQ) Recovery',
        description: 'Failed messages are routed to quarantine topics for automatic retry or manual inspection.',
      },
      {
        title: 'Docker Compose Local Cluster',
        description: 'Single-command local environment spinning up Kafka, Zookeeper, and multiple Postgres instances.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: Kafka & Database Infrastructure Setup',
        description: 'Define Docker Compose files and establish event contract schemas.',
        tasks: [
          'Configure Kafka, Zookeeper, and individual service databases via Docker Compose',
          'Create typed event payloads shared across services (OrderCreatedEvent, InventoryReservedEvent)',
          'Implement Kafka producer and consumer wrapper libraries',
        ],
      },
      {
        title: 'Stage 2: Order & Inventory Services',
        description: 'Build primary business services and wire up event emission.',
        tasks: [
          'Create Order Service REST endpoints to create and query orders',
          'Create Inventory Service tracking SKU stock levels with row locks',
          'Wire Order Service to publish to Kafka and Inventory Service to consume and reserve stock',
        ],
      },
      {
        title: 'Stage 3: Saga Rollback & Compensation',
        description: 'Implement distributed error handling when payment fails or inventory is depleted.',
        tasks: [
          'Simulate payment failure and trigger OrderCancelledEvent',
          'Implement compensation handler in Inventory Service to restore reserved units',
          'Store idempotency keys in Redis to guard against duplicate message processing',
        ],
      },
      {
        title: 'Stage 4: Asynchronous Notification Worker',
        description: 'Build standalone notification worker to consume finalized order events.',
        tasks: [
          'Consume OrderCompleted events and generate transactional receipt payloads',
          'Configure Dead-Letter Queue (DLQ) for unhandled exceptions with exponential backoff',
          'Add end-to-end integration test validating the entire checkout loop',
        ],
      },
    ],
  },
  {
    id: 'fintech-transaction-ledger',
    slug: 'fintech-transaction-ledger',
    title: 'Fintech Transaction Ledger & Double-Entry Accounting',
    shortDescription: 'Build an immutable, audit-compliant financial ledger system with double-entry bookkeeping and ACID guarantees.',
    description: 'A financial accounting backend engineered around the principles of double-entry bookkeeping. Every financial event is recorded as immutable balanced debit and credit entries, guaranteeing that money is neither created nor destroyed in transit.',
    category: 'Systems & Backend',
    difficulty: 'expert',
    estimatedDuration: '3 Weeks',
    projectType: 'Financial System',
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Jest', 'Docker'],
    skills: ['Double-Entry Bookkeeping', 'ACID Transactions', 'Pessimistic Locking', 'Audit Trail Integrity', 'Financial Mathematics'],
    featured: false,
    relatedRoadmapIds: ['backend-developer'],
    architecture: `Client Request: Transfer $500 from Account A to Account B
   │
   ▼
Transaction Coordinator
   │
   ├── 1. Acquire Pessimistic Locks on Account A and Account B (SELECT FOR UPDATE)
   ├── 2. Verify Account A available balance >= $500
   ├── 3. Create Balanced Journal Entry:
   │      - Entry 1: Debit Account A -$500
   │      - Entry 2: Credit Account B +$500
   │      - Invariant: SUM(Debits) + SUM(Credits) === 0
   │
   ▼ Atomic Database Commit (ACID Isolation)
PostgreSQL Ledger Table (Append-Only / Immutable)`,
    folderStructure: `fintech-ledger/
├── src/
│   ├── core/
│   │   ├── ledger.service.ts
│   │   ├── accounts.service.ts
│   │   └── math.utils.ts
│   ├── db/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── api/
│       └── transfers.controller.ts
├── tests/
│   └── concurrency.test.ts
├── package.json
└── README.md`,
    features: [
      {
        title: 'Strict Double-Entry Invariant',
        description: 'Every journal transaction contains at least two postings whose debits and credits mathematically balance.',
      },
      {
        title: 'Immutable Append-Only Records',
        description: 'Ledger entries are append-only. Corrections require explicit reversal postings rather than mutating existing rows.',
      },
      {
        title: 'Pessimistic Concurrency Locking',
        description: 'Prevents double-spending under high concurrent debit requests using SELECT FOR UPDATE row-level locks.',
      },
      {
        title: 'Multi-Currency Precision Math',
        description: 'Uses integer minor units (cents/satoshis) or Decimal representations to eliminate floating-point rounding errors.',
      },
    ],
    milestones: [
      {
        title: 'Stage 1: Ledger Data Model & Invariants',
        description: 'Design Account, JournalEntry, and Posting tables with strict foreign key constraints.',
        tasks: [
          'Define Prisma schema with Account (Asset, Liability, Equity, Revenue, Expense)',
          'Create Posting table with amount, direction (DEBIT/CREDIT), and account_id',
          'Write database check constraint ensuring sum of postings per transaction equals zero',
        ],
      },
      {
        title: 'Stage 2: Atomic Transfer Service',
        description: 'Implement transfer funds function executing inside a strict database transaction.',
        tasks: [
          'Acquire ordered locks on accounts to prevent database deadlocks',
          'Verify sufficient balance and pending holds',
          'Insert balanced postings and update cached balances atomically',
        ],
      },
      {
        title: 'Stage 3: Concurrency Stress Testing',
        description: 'Write integration tests simulating concurrent transfers between the same accounts.',
        tasks: [
          'Write test with 50 parallel transfer requests attempting to overdraw an account',
          'Verify no race condition permits a negative balance when overdraft is disabled',
          'Confirm ledger sum invariants remain 100% consistent after heavy load',
        ],
      },
      {
        title: 'Stage 4: Audit & Balance Reporting',
        description: 'Build balance sheet and trial balance generation queries.',
        tasks: [
          'Implement point-in-time balance reconstruction from raw historical postings',
          'Create Trial Balance reporting endpoint',
          'Add cryptographic hash chaining (Merkle or SHA256) to ensure ledger tamper resistance',
        ],
      },
    ],
  },
];

export function getProjectBySlug(slug: string): CuratedProject | undefined {
  return curatedProjects.find((p) => p.slug === slug);
}


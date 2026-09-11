export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string;
  projectType: string;
  experienceLevel: string;
  technologies: string[];
  skills: string[];
  learningOutcomes: string[];
  features: { title: string; description: string }[];
  requirements: string[];
  milestones: {
    title: string;
    description: string;
    order: number;
    objectives: string[];
    tasks: string[];
    estimatedDuration: string;
  }[];
  architecture: string;
  folderStructure: string;
  relatedRoadmapIds: string[];
  featured: boolean;
}

export const staticProjects: ProjectItem[] = [
  {
    id: 'proj-kanban-board',
    slug: 'collaborative-kanban-board',
    title: 'Real-Time Collaborative Kanban Board',
    shortDescription:
      'Build a modern drag-and-drop task management application featuring multi-user live synchronization over WebSockets and optimistic updates.',
    description:
      'A full-stack, real-time Kanban board application built with Next.js, WebSockets, and PostgreSQL. Users can create customizable workspaces, organize tasks across multi-stage columns, assign deadlines, and collaborate simultaneously with team members. State changes made by any connected client are broadcast in sub-50ms with collision handling and optimistic UI updating.',
    category: 'Full Stack Development',
    difficulty: 'intermediate',
    estimatedDuration: '2-3 weeks',
    projectType: 'Full-Stack Web App',
    experienceLevel: 'Intermediate',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Socket.io', 'PostgreSQL', 'Prisma ORM'],
    skills: ['Real-time Synchronization', 'Database Schema Modeling', 'Drag-and-Drop UX', 'Optimistic UI', 'REST & WebSocket APIs'],
    learningOutcomes: [
      'Master WebSocket connection lifecycles, reconnection handling, and room-based pub/sub broadcasting.',
      'Implement accessible, physics-based drag-and-drop mechanics using modern React state patterns.',
      'Design relational schemas with cascade behaviors, audit logs, and composite indexes in PostgreSQL.',
      'Deliver fluid optimistic UI updates that roll back gracefully upon network failure.'
    ],
    features: [
      { title: 'Multi-Tenant Workspaces', description: 'Create separate team spaces with role-based access control (Admin, Member, Viewer).' },
      { title: 'Real-Time State Sync', description: 'Card movements, edits, and label changes instantly reflect on all active clients.' },
      { title: 'Interactive Drag & Drop', description: 'Smooth reordering within columns and seamless cross-column transitions.' },
      { title: 'Activity Timeline & Audit Trail', description: 'Historical record of all modifications with author timestamps and commit messages.' }
    ],
    requirements: [
      'Node.js 18+ runtime environment',
      'PostgreSQL instance (local or Supabase/Neon)',
      'Modern web browser supporting WebSockets and modern CSS Grid'
    ],
    milestones: [
      {
        order: 1,
        title: 'Data Modeling & Relational Schema Setup',
        description: 'Define PostgreSQL schema with Prisma ORM including Users, Workspaces, Boards, Columns, Cards, and ActivityLogs.',
        estimatedDuration: '3 days',
        objectives: ['Design normalized database structure', 'Generate migrations', 'Seed test data'],
        tasks: ['Install Prisma and configure connection string', 'Define schema.prisma models', 'Execute initial migration and seed script']
      },
      {
        order: 2,
        title: 'Core Board UI & Drag-and-Drop Interaction',
        description: 'Develop responsive board layouts with column virtualization and accessible drag-and-drop interactions.',
        estimatedDuration: '4 days',
        objectives: ['Build Column and Card components', 'Integrate @hello-pangea/dnd or dnd-kit', 'Handle optimistic local reordering'],
        tasks: ['Implement Board view with responsive horizontal scroll', 'Setup drag sensors and drop target zones', 'Wire local reorder state handlers']
      },
      {
        order: 3,
        title: 'WebSocket Real-Time Server & Broadcasting',
        description: 'Implement a WebSocket gateway that broadcasts workspace room events to connected team members.',
        estimatedDuration: '4 days',
        objectives: ['Create Socket.io server', 'Handle user presence and workspace rooms', 'Broadcast card move/update payloads'],
        tasks: ['Configure WebSocket server integration', 'Authenticate socket handshakes with JWT', 'Emit granular card-moved events']
      },
      {
        order: 4,
        title: 'Authentication & Production Deployment',
        description: 'Secure API routes with session authentication, rate limiting, and deploy to production cloud hosting.',
        estimatedDuration: '3 days',
        objectives: ['Implement auth flows', 'Add database indexing for query speed', 'Deploy web client and background socket service'],
        tasks: ['Connect OAuth or credentials auth', 'Add query rate limiting middleware', 'Configure Vercel + Railway/Render deployment']
      }
    ],
    architecture: 'Next.js Frontend with App Router -> Node.js / Next.js Server Actions & WebSocket Gateway -> Prisma ORM -> PostgreSQL Database.',
    folderStructure: `collaborative-kanban/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── board/[id]/
│   │   └── api/
│   ├── components/
│   │   ├── board/
│   │   ├── card/
│   │   └── ui/
│   ├── hooks/
│   │   └── use-socket.ts
│   └── lib/
│       ├── prisma.ts
│       └── socket-client.ts
└── server/
    └── websocket.ts`,
    relatedRoadmapIds: ['full-stack-developer', 'frontend-developer', 'backend-developer'],
    featured: true
  },
  {
    id: 'proj-distributed-cache',
    slug: 'distributed-key-value-store',
    title: 'Distributed In-Memory Key-Value Store & Cache',
    shortDescription:
      'Design a high-performance in-memory cache supporting the Redis RESP protocol, LRU memory eviction, active TTL expiration, and TCP networking.',
    description:
      'A production-grade distributed key-value storage engine inspired by Redis and Memcached. Implements a custom non-blocking TCP socket server, concurrent-safe hash table sharding, Least Recently Used (LRU) memory eviction with fixed memory limits, and background active key expiration. Built to teach low-level systems programming, networking protocols, and concurrent memory management.',
    category: 'Systems & Backend Architecture',
    difficulty: 'advanced',
    estimatedDuration: '3-4 weeks',
    projectType: 'Backend Systems Engine',
    experienceLevel: 'Advanced',
    technologies: ['Go', 'TypeScript', 'Node.js', 'TCP Sockets', 'Concurrency', 'Docker'],
    skills: ['TCP Protocol Design', 'Memory Eviction Algorithms', 'Thread-Safe Concurrency', 'Benchmarking & Profiling', 'Buffer Parsing'],
    learningOutcomes: [
      'Implement the Redis Serialization Protocol (RESP) parser handling bulk strings, arrays, integers, and error tokens.',
      'Build an O(1) Least Recently Used (LRU) eviction cache using a doubly linked list combined with an in-memory hash map.',
      'Achieve high throughput under concurrent access using striping and read-write mutex locks.',
      'Benchmark throughput and latency under load with redis-benchmark.'
    ],
    features: [
      { title: 'Redis RESP Wire Protocol', description: 'Fully compatible with standard redis-cli commands including GET, SET, DEL, EXPIRE, and MGET.' },
      { title: 'O(1) LRU Eviction', description: 'Configurable maximum memory ceiling with automatic eviction of the least recently used keys.' },
      { title: 'Active & Passive Expiration', description: 'Keys expire automatically either upon access (passive) or via periodic sampling cycles (active).' },
      { title: 'Concurrent-Safe Sharding', description: 'Partitioned hash buckets with read/write mutexes eliminating global lock contention.' }
    ],
    requirements: [
      'Go 1.21+ or Node.js 20+ with native socket support',
      'redis-cli or netcat for command testing',
      'Linux/macOS terminal or Windows WSL2 for benchmarking'
    ],
    milestones: [
      {
        order: 1,
        title: 'TCP Server & RESP Protocol Parser',
        description: 'Establish non-blocking TCP socket server and parse Redis RESP specification types.',
        estimatedDuration: '4 days',
        objectives: ['Parse RESP framing from raw TCP stream', 'Serialize responses back to client', 'Verify compatibility with redis-cli'],
        tasks: ['Build socket listener', 'Implement byte buffer scanner for RESP format', 'Validate simple PING and ECHO commands']
      },
      {
        order: 2,
        title: 'In-Memory Key-Value Engine with LRU',
        description: 'Construct the thread-safe storage core with doubly linked list tracking for O(1) LRU eviction.',
        estimatedDuration: '5 days',
        objectives: ['Build doubly-linked list node tracking', 'Implement max-memory boundary check', 'Evict oldest entry on overflow'],
        tasks: ['Code generic DLL data structure', 'Map keys to DLL nodes in hash table', 'Unit test eviction order under memory pressure']
      },
      {
        order: 3,
        title: 'TTL Support & Background Expiration Loop',
        description: 'Implement key expiration timestamps with dual passive (on-access) and active (sampling loop) cleanup.',
        estimatedDuration: '4 days',
        objectives: ['Store expiration millisecond deadlines', 'Check expiration on GET requests', 'Run probabilistic active cleanup ticker'],
        tasks: ['Implement EXPIRE, TTL, and PEXPIRE commands', 'Create background ticker sampling random expired keys', 'Add memory reclaim metrics']
      },
      {
        order: 4,
        title: 'Benchmarking, Profiling & Concurrency Optimization',
        description: 'Measure QPS with redis-benchmark, profile lock contention, and implement bucket striping.',
        estimatedDuration: '4 days',
        objectives: ['Run redis-benchmark -t set,get', 'Shard internal hash map into N stripes', 'Measure P99 latency'],
        tasks: ['Benchmark single vs striped lock performance', 'Profile CPU and memory allocation hotspots', 'Containerize with Dockerfile']
      }
    ],
    architecture: 'TCP Client -> TCP Socket Listener -> RESP Protocol Decoder -> Command Dispatcher -> Striped Concurrent Store (LRU Cache + Expiration Index) -> RESP Encoder -> TCP Response.',
    folderStructure: `key-value-store/
├── cmd/
│   └── server/
│       └── main.go
├── pkg/
│   ├── cache/
│   │   ├── lru.go
│   │   └── ttl.go
│   ├── protocol/
│   │   ├── resp_parser.go
│   │   └── resp_writer.go
│   └── store/
│       ├── store.go
│       └── sharded_map.go
├── Dockerfile
└── README.md`,
    relatedRoadmapIds: ['backend-developer', 'devops-engineer'],
    featured: true
  },
  {
    id: 'proj-ai-document-rag',
    slug: 'ai-document-analyzer',
    title: 'AI Document Research & Semantic Q&A Assistant',
    shortDescription:
      'Develop an enterprise-grade Retrieval-Augmented Generation (RAG) platform to upload PDFs, generate vector embeddings, and conduct semantic question-answering with citations.',
    description:
      'An intelligent document processing platform that ingests unstructured technical documents, extracts text and tabular figures, computes semantic embeddings, and stores them in a vector database. Users can converse with their library in natural language, receiving synthesized answers backed by precise page citations, confidence scores, and highlightable snippets.',
    category: 'Artificial Intelligence & Machine Learning',
    difficulty: 'intermediate',
    estimatedDuration: '2-3 weeks',
    projectType: 'AI/ML Web Application',
    experienceLevel: 'Intermediate',
    technologies: ['Python', 'FastAPI', 'Next.js', 'LangChain', 'OpenAI API', 'ChromaDB', 'Tailwind CSS'],
    skills: ['Retrieval-Augmented Generation (RAG)', 'Vector Embeddings & Cosine Search', 'Prompt Engineering', 'Document Parsing', 'Streaming Responses'],
    learningOutcomes: [
      'Understand chunking strategies (fixed-size vs recursive character vs semantic boundary) and their impact on retrieval recall.',
      'Deploy and query a vector store using dense embedding vectors and cosine similarity distance metrics.',
      'Construct grounded prompt templates preventing hallucination by enforcing strict context attribution.',
      'Stream token-by-token completions to the frontend using Server-Sent Events (SSE).'
    ],
    features: [
      { title: 'PDF & Markdown Ingestion', description: 'Upload multiple files with automatic text parsing, metadata tagging, and chunking.' },
      { title: 'Semantic Similarity Search', description: 'Vector similarity search retrieving the most relevant context passages in milliseconds.' },
      { title: 'Grounded Responses with Citations', description: 'Every answer explicitly references the source document name, page number, and paragraph.' },
      { title: 'Token Streaming UI', description: 'Real-time typewriter streaming response interface with markdown rendering and code highlighting.' }
    ],
    requirements: [
      'Python 3.10+ runtime and Node.js 18+',
      'OpenAI API Key or local Ollama / HuggingFace embedding models',
      'ChromaDB or PostgreSQL with pgvector extension'
    ],
    milestones: [
      {
        order: 1,
        title: 'Document Parser & Chunking Pipeline',
        description: 'Build text extraction from PDFs and implement recursive text chunking with token overlap.',
        estimatedDuration: '3 days',
        objectives: ['Extract text and page metadata from PDFs', 'Tune chunk size and overlap parameters', 'Clean headers and whitespace'],
        tasks: ['Install pypdf / pdfplumber', 'Implement RecursiveCharacterTextSplitter', 'Test chunk boundary consistency']
      },
      {
        order: 2,
        title: 'Vector Database Ingestion & Similarity Index',
        description: 'Compute dense vector embeddings and index chunks into a vector database for semantic retrieval.',
        estimatedDuration: '4 days',
        objectives: ['Generate embeddings with text-embedding-3-small', 'Index vectors into ChromaDB', 'Query top-K relevant passages'],
        tasks: ['Setup ChromaDB client', 'Batch upsert chunks with page metadata', 'Verify top-K retrieval accuracy with test queries']
      },
      {
        order: 3,
        title: 'RAG Prompt Engineering & Streaming API',
        description: 'Synthesize answers using an LLM conditioned on retrieved context, streaming responses over SSE.',
        estimatedDuration: '4 days',
        objectives: ['Draft anti-hallucination system prompt', 'Integrate streaming chat completions', 'Format page citation payloads'],
        tasks: ['Create FastAPI streaming endpoint with StreamingResponse', 'Pass top-K context into prompt context block', 'Handle source attribution metadata']
      },
      {
        order: 4,
        title: 'Modern Next.js Chat Interface',
        description: 'Develop the user interface for document management, question prompting, and inline source citation cards.',
        estimatedDuration: '4 days',
        objectives: ['Build drag-and-drop file uploader', 'Implement streaming chat UI with React hooks', 'Render clickable source references'],
        tasks: ['Create FileUpload dropzone component', 'Hook up EventSource or fetch reader for streaming tokens', 'Add markdown syntax highlighting']
      }
    ],
    architecture: 'Next.js Frontend -> FastAPI Backend API -> Document Chunking Pipeline -> Vector Database (ChromaDB / pgvector) -> LLM Provider (OpenAI/Ollama) -> Streamed Response.',
    folderStructure: `ai-document-rag/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   │   ├── chunker.py
│   │   │   ├── embeddings.py
│   │   │   └── rag.py
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── hooks/
│   └── package.json
└── README.md`,
    relatedRoadmapIds: ['ai-engineer', 'backend-developer', 'full-stack-developer'],
    featured: true
  },
  {
    id: 'proj-microservices-ecommerce',
    slug: 'microservices-ecommerce-platform',
    title: 'Microservices Event-Driven E-Commerce API',
    shortDescription:
      'Architect a distributed e-commerce backend with independent microservices for Catalog, Orders, Payments, and Notifications orchestrated via RabbitMQ.',
    description:
      'An enterprise microservices demonstration platform showing how to build, containerize, and orchestrate independent domain services without direct coupling. Features an API Gateway for routing and authentication, asynchronous event distribution over RabbitMQ using the Saga pattern for distributed checkout transactions, and Redis caching for high-speed catalog browsing.',
    category: 'Cloud & Distributed Systems',
    difficulty: 'advanced',
    estimatedDuration: '3-4 weeks',
    projectType: 'Backend Microservices Architecture',
    experienceLevel: 'Advanced',
    technologies: ['Node.js', 'Express', 'RabbitMQ', 'PostgreSQL', 'Redis', 'Docker', 'Docker Compose'],
    skills: ['Microservices Patterns', 'Message Queues (Pub/Sub)', 'Distributed Transactions (Sagas)', 'API Gateway Routing', 'Container Orchestration'],
    learningOutcomes: [
      'Decouple business capabilities into discrete microservices with database-per-service isolation.',
      'Implement the Choreography-based Saga pattern to handle distributed compensation when payment fails.',
      'Configure an API Gateway handling SSL termination, rate limiting, and reverse proxy routing.',
      'Orchestrate multi-container environments locally and in CI/CD using Docker Compose.'
    ],
    features: [
      { title: 'Independent Service Isolation', description: 'Distinct services for Products, Orders, Payments, and Notifications, each with its own database.' },
      { title: 'Asynchronous Event Bus', description: 'RabbitMQ message broker handling event topics like OrderCreated, PaymentProcessed, and OrderCancelled.' },
      { title: 'Distributed Saga Checkout', description: 'Coordinated order state machine with automatic compensation rollbacks upon payment decline.' },
      { title: 'API Gateway & Rate Limiting', description: 'Central reverse proxy with unified JWT validation and Redis-backed rate limiting.' }
    ],
    requirements: [
      'Docker and Docker Compose installed',
      'Node.js 18+ or Go runtime',
      'Postman or Thunder Client for testing API workflows'
    ],
    milestones: [
      {
        order: 1,
        title: 'Domain Modeling & Service Separation',
        description: 'Define microservice boundaries and initialize independent Express services with isolated PostgreSQL schemas.',
        estimatedDuration: '4 days',
        objectives: ['Structure service directories', 'Define database-per-service schemas', 'Write Dockerfiles for each service'],
        tasks: ['Create catalog-service, order-service, and payment-service', 'Create schema migrations for each database', 'Verify independent startup']
      },
      {
        order: 2,
        title: 'RabbitMQ Event Broker Integration',
        description: 'Setup RabbitMQ exchanges and queues to publish and consume domain events across services.',
        estimatedDuration: '4 days',
        objectives: ['Deploy RabbitMQ with management UI', 'Implement resilient pub/sub wrapper with retries', 'Broadcast OrderCreated events'],
        tasks: ['Configure amqplib connection pools', 'Define durable exchanges and dead-letter queues', 'Verify message receipt in consuming services']
      },
      {
        order: 3,
        title: 'Distributed Saga Pattern Implementation',
        description: 'Implement the payment processing saga with rollback compensation if payment fails or inventory runs out.',
        estimatedDuration: '5 days',
        objectives: ['Design order state transitions (Pending, Confirmed, Failed)', 'Implement compensation events', 'Verify consistency under error injection'],
        tasks: ['Trigger payment processing upon OrderCreated', 'Handle payment failure by emitting PaymentFailed', 'Order service listens and cancels pending order']
      },
      {
        order: 4,
        title: 'API Gateway, Redis Cache & Docker Compose',
        description: 'Wrap services behind an API Gateway, cache product endpoints in Redis, and deliver single-command spin-up.',
        estimatedDuration: '4 days',
        objectives: ['Build API Gateway reverse proxy', 'Implement Redis cache for product catalog', 'Write root docker-compose.yml'],
        tasks: ['Configure routing rules and JWT token verification', 'Add cache-aside pattern to product catalog', 'Test entire flow with `docker compose up`']
      }
    ],
    architecture: 'Client -> API Gateway (Reverse Proxy / Auth / Rate Limit) -> [Catalog Service, Order Service, Payment Service] <-> RabbitMQ Event Bus <-> Notification Service -> Worker & Email Dispatcher.',
    folderStructure: `ecommerce-microservices/
├── services/
│   ├── api-gateway/
│   ├── catalog-service/
│   ├── order-service/
│   ├── payment-service/
│   └── notification-service/
├── docker-compose.yml
├── .env.example
└── README.md`,
    relatedRoadmapIds: ['backend-developer', 'devops-engineer'],
    featured: false
  },
  {
    id: 'proj-finance-pwa',
    slug: 'personal-finance-pwa',
    title: 'Offline-First Personal Finance & Expense Tracker PWA',
    shortDescription:
      'Build a privacy-preserving, offline-first personal finance tracker with interactive spending analytics, IndexedDB storage, and PWA installability.',
    description:
      'A responsive Progressive Web App designed to help students track monthly budgets, split shared apartment bills, and visualize spending trends across categories. Built offline-first so that users can log expenses anywhere with zero latency, storing all sensitive financial data privately in browser IndexedDB with optional encrypted backup.',
    category: 'Frontend & Mobile Web',
    difficulty: 'beginner',
    estimatedDuration: '1-2 weeks',
    projectType: 'Client-Side Web App',
    experienceLevel: 'Beginner',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'Chart.js', 'Service Workers'],
    skills: ['Offline Storage (IndexedDB)', 'Progressive Web Apps (PWA)', 'Data Visualization', 'Client-Side State Management', 'Responsive Mobile-First UI'],
    learningOutcomes: [
      'Leverage browser IndexedDB with Dexie.js for client-side ACID transactions and complex indexing.',
      'Configure Service Worker caching strategies (stale-while-revalidate) for instant page loads even offline.',
      'Render dynamic interactive financial charts with Chart.js and compute breakdown summaries.',
      'Produce an installable PWA with web app manifest, custom app icons, and offline fallback.'
    ],
    features: [
      { title: '100% Offline Capable', description: 'Log expenses and inspect reports without an active internet connection.' },
      { title: 'Visual Spending Analytics', description: 'Interactive pie charts, monthly burn-rate line charts, and category comparisons.' },
      { title: 'Zero Data Collection Privacy', description: 'All records remain on user device storage with CSV and JSON import/export options.' },
      { title: 'Installable PWA Experience', description: 'Installs directly to mobile home screens and desktop apps with native-like performance.' }
    ],
    requirements: [
      'Node.js 18+ and modern web browser (Chrome/Safari/Firefox)',
      'Basic knowledge of React hooks (useState, useEffect, useMemo)'
    ],
    milestones: [
      {
        order: 1,
        title: 'Project Setup & Mobile-First UI Skeleton',
        description: 'Initialize Vite React project with Tailwind CSS and construct responsive layout shell.',
        estimatedDuration: '2 days',
        objectives: ['Set up Tailwind typography and palette', 'Create bottom navigation bar', 'Build transaction list component'],
        tasks: ['Initialize Vite project with TypeScript', 'Configure theme variables', 'Create layout wrapper with mobile bottom bar']
      },
      {
        order: 2,
        title: 'IndexedDB Data Store & Transaction CRUD',
        description: 'Integrate Dexie.js for transactional client-side storage with indexes for dates and categories.',
        estimatedDuration: '3 days',
        objectives: ['Define IndexedDB schema with Dexie.js', 'Implement Add/Edit/Delete expense modals', 'Add date range filters'],
        tasks: ['Install dexie and dexie-react-hooks', 'Create database schema with transaction tables', 'Connect CRUD form state to Dexie hooks']
      },
      {
        order: 3,
        title: 'Interactive Analytics & Budget Targets',
        description: 'Integrate Chart.js to visualize expense breakdowns and monthly budget thresholds.',
        estimatedDuration: '3 days',
        objectives: ['Compute category percentages', 'Render donut chart for categories', 'Render bar chart for monthly comparisons'],
        tasks: ['Install chart.js and react-chartjs-2', 'Build dynamic chart aggregator hooks', 'Add budget progress bars with alert states']
      },
      {
        order: 4,
        title: 'PWA Manifest, Service Worker & Export',
        description: 'Add web app manifest, install prompts, service worker caching, and CSV data export.',
        estimatedDuration: '2 days',
        objectives: ['Configure vite-plugin-pwa', 'Generate app icons and manifest.json', 'Add CSV export and import parser'],
        tasks: ['Configure Service Worker caching', 'Validate PWA installability in Chrome DevTools', 'Build CSV exporter and test on mobile device']
      }
    ],
    architecture: 'React Client -> Dexie.js (IndexedDB ORM) -> Local Device Storage -> Chart.js Visualizer + Service Worker Cache Layer.',
    folderStructure: `finance-pwa/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── charts/
│   │   ├── layout/
│   │   └── transactions/
│   ├── db/
│   │   └── database.ts
│   ├── types/
│   └── App.tsx
├── vite.config.ts
└── package.json`,
    relatedRoadmapIds: ['frontend-developer', 'mobile-developer'],
    featured: false
  },
  {
    id: 'proj-dev-portfolio-cms',
    slug: 'dev-portfolio-cms',
    title: 'Developer Portfolio & Technical Blog Engine',
    shortDescription:
      'Design a blazingly fast, modern developer portfolio featuring MDX blogging, syntax highlighting, view counts, and automated SEO metadata.',
    description:
      'A sleek, high-converting portfolio website and technical blog engineered for software engineers seeking internships or full-time roles. Features statically rendered MDX articles with interactive React components, automatic reading-time calculation, Open Graph social share image generation, and RSS feeds.',
    category: 'Frontend Development',
    difficulty: 'beginner',
    estimatedDuration: '1-2 weeks',
    projectType: 'Portfolio & Publishing Platform',
    experienceLevel: 'Beginner',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MDX', 'Contentlayer / Velite'],
    skills: ['Static Site Generation (SSG)', 'MDX Compilation & Custom Components', 'SEO & OpenGraph Optimization', 'Design System & Typography', 'Accessibility'],
    learningOutcomes: [
      'Structure clean, reusable UI components using Tailwind CSS and modern CSS variables.',
      'Parse frontmatter and compile Markdown/MDX content at build time for instant page loads.',
      'Generate dynamic XML sitemaps and RSS feeds to maximize search engine discovery.',
      'Achieve 100/100 Lighthouse scores across Performance, Accessibility, and Best Practices.'
    ],
    features: [
      { title: 'Interactive MDX Articles', description: 'Embed live interactive widgets, code playgrounds, and callout banners inside Markdown.' },
      { title: 'Code Syntax Highlighting', description: 'Prism / Shiki syntax highlighting with copy-to-clipboard buttons and language badges.' },
      { title: 'Automated SEO & Social Cards', description: 'Dynamic Open Graph meta tags and images for rich Twitter and LinkedIn previews.' },
      { title: 'Full Dark / Light Mode', description: 'Flicker-free theme switching with system preference detection and localStorage persistence.' }
    ],
    requirements: [
      'Node.js 18+ runtime',
      'Basic familiarity with Markdown and Next.js'
    ],
    milestones: [
      {
        order: 1,
        title: 'Next.js App Setup & Visual Design System',
        description: 'Initialize Next.js project with Tailwind CSS typography plugin and dark mode toggle.',
        estimatedDuration: '2 days',
        objectives: ['Set up typography and container utilities', 'Create responsive navigation and footer', 'Implement next-themes dark mode'],
        tasks: ['Create Next.js App Router project', 'Install @tailwindcss/typography', 'Build Navbar and ThemeToggle components']
      },
      {
        order: 2,
        title: 'Project Showcase & About Section',
        description: 'Build portfolio project cards with live demo links, GitHub repo buttons, and tech stack tags.',
        estimatedDuration: '2 days',
        objectives: ['Design ProjectCard component', 'Add filtering by technology', 'Write engaging About Me and Experience timeline'],
        tasks: ['Define project metadata types', 'Build responsive project grid', 'Implement interactive skill tags']
      },
      {
        order: 3,
        title: 'MDX Blog Engine with Code Syntax Highlighting',
        description: 'Implement static MDX content processing with frontmatter extraction and Shiki code styling.',
        estimatedDuration: '3 days',
        objectives: ['Setup MDX content directory', 'Configure Shiki or Rehype-pretty-code', 'Create custom MDX callout and image components'],
        tasks: ['Configure MDX loader or Velite', 'Build dynamic [slug] article page', 'Style typography with Tailwind prose classes']
      },
      {
        order: 4,
        title: 'SEO, Sitemap & Production Deployment',
        description: 'Add OpenGraph card generation, sitemap.xml, RSS feed, and deploy to Vercel.',
        estimatedDuration: '2 days',
        objectives: ['Implement generateMetadata with OpenGraph', 'Generate automated RSS 2.0 feed', 'Deploy to Vercel with custom domain'],
        tasks: ['Create sitemap.ts and robots.ts', 'Test OpenGraph previews on social debuggers', 'Deploy to production on Vercel']
      }
    ],
    architecture: 'Next.js App Router (Static Site Generation) -> Contentlayer / MDX Parser -> Shiki Syntax Highlighter -> Tailwind Typography -> Vercel Edge CDN.',
    folderStructure: `dev-portfolio/
├── content/
│   ├── posts/
│   └── projects/
├── src/
│   ├── app/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── page.tsx
│   ├── components/
│   │   ├── mdx/
│   │   └── ui/
│   └── lib/
├── tailwind.config.ts
└── package.json`,
    relatedRoadmapIds: ['frontend-developer', 'full-stack-developer'],
    featured: false
  }
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return staticProjects.find((p) => p.slug === slug);
}

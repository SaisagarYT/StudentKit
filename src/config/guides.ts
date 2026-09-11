export interface GuideSection {
  title: string;
  id: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface TechnicalGuide {
  slug: string;
  title: string;
  subtitle: string;
  category: 'systems' | 'backend' | 'security' | 'frontend' | 'career';
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  publishedDate: string;
  summary: string;
  whyItExists: string;
  industryArchitecture: string;
  sections: GuideSection[];
  interviewQuestions: {
    question: string;
    idealAnswer: string;
  }[];
  resumeBulletPoints: string[];
}

export const technicalGuides: TechnicalGuide[] = [
  {
    slug: 'building-distributed-cache',
    title: 'Building a Distributed In-Memory Cache from Scratch',
    subtitle: 'Learn cache eviction strategies, consistent hashing, and high-concurrency memory management.',
    category: 'systems',
    readTime: '12 min read',
    difficulty: 'Intermediate',
    tags: ['System Design', 'Caching', 'Go', 'Algorithms', 'Distributed Systems'],
    publishedDate: '2026-03-15',
    summary: 'An architectural deep dive into how Redis and Memcached handle fast in-memory key-value storage, LRU/LFU eviction, and distributed sharding.',
    whyItExists: 'Databases are bound by disk I/O, relational constraints, and connection pooling limits. In modern web architectures handling tens of thousands of requests per second, querying primary databases on every request introduces unacceptable latency. Distributed in-memory caches exist to bridge the speed gap between microsecond CPU memory access and millisecond disk storage.',
    industryArchitecture: 'Production caches like Redis use single-threaded event loops with multiplexed I/O (epoll/kqueue) to avoid lock contention, while Memcached uses multi-threaded worker pools with slab memory allocation to prevent heap fragmentation. At scale, nodes are clustered using Consistent Hashing rings with virtual nodes to distribute key-value pairs evenly across multiple servers without rebalancing all data when a node fails.',
    sections: [
      {
        id: 'lru-eviction',
        title: '1. Designing Least Recently Used (LRU) Eviction',
        content: 'To achieve O(1) time complexity for both GET and PUT operations with LRU eviction, we combine a Hash Map with a Doubly Linked List. The hash map stores keys mapped to node pointers in the linked list. Whenever a key is accessed or modified, its corresponding node is detached and moved to the head of the list. When capacity is exceeded, the node at the tail is purged.',
        codeSnippet: {
          language: 'typescript',
          code: `class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, Node<K, V>> = new Map();
  private head: Node<K, V> = new Node();
  private tail: Node<K, V> = new Node();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | null {
    const node = this.cache.get(key);
    if (!node) return null;
    this.moveToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new Node(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      if (this.cache.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
      }
    }
  }
}`
        }
      },
      {
        id: 'cache-concurrency',
        title: '2. Handling Concurrency: Cache Aside vs Write-Through',
        content: 'In distributed systems, choosing the correct cache update pattern is critical to prevent stale reads and race conditions. In the Cache-Aside (Lazy Loading) pattern, the application queries the cache first. On a cache miss, it reads from the database, updates the cache, and returns. In Write-Through, the application writes to the cache, which synchronously updates the database.',
      },
      {
        id: 'cache-stampede',
        title: '3. Mitigating Cache Stampede (Thundering Herd Problem)',
        content: 'When a popular cached key expires, thousands of simultaneous incoming requests may miss the cache simultaneously and hit the database at once, causing cascading failure. Solutions include Mutual Exclusion Locks (single-flight mutexes), Probabilistic Early Expiration (XFetch algorithm), or background asynchronous cache warmers.',
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the time and space complexity of an LRU cache, and why is a doubly linked list used instead of a singly linked list?',
        idealAnswer: 'Both GET and PUT operations run in O(1) time complexity, with O(N) space complexity where N is the capacity. A doubly linked list is essential because removing an arbitrary node requires updating the previous node pointer (prev.next = next). In a singly linked list, finding the previous node requires an O(N) traversal from the head, which would degrade eviction to O(N).'
      },
      {
        question: 'How do you handle the Thundering Herd (Cache Stampede) problem in high-scale systems?',
        idealAnswer: 'Three main patterns: 1) Mutex / Distributed Lock: Only the first thread that misses the cache is allowed to query the database and populate the cache; other threads wait or retry. 2) Background Warmers: Keys are asynchronously refreshed before their TTL expires. 3) Probabilistic Early Refresh: When a key is near expiration, requests calculate a random delta to refresh the key early before it officially expires.'
      }
    ],
    resumeBulletPoints: [
      'Architected and implemented a high-performance in-memory LRU cache in TypeScript/Go supporting sub-millisecond O(1) read/write operations and automatic memory eviction.',
      'Prevented cache stampede and thundering herd failures across 10k+ peak concurrent requests using single-flight mutex locks and probabilistic early expiration algorithms.'
    ]
  },
  {
    slug: 'sql-vs-nosql-database-architecture',
    title: 'SQL vs NoSQL: High-Scale Database Architecture & Trade-Offs',
    subtitle: 'ACID guarantees, CAP theorem, indexing strategies, and choosing between PostgreSQL, MongoDB, and Redis.',
    category: 'backend',
    readTime: '10 min read',
    difficulty: 'Beginner',
    tags: ['Databases', 'PostgreSQL', 'MongoDB', 'System Design', 'Architecture'],
    publishedDate: '2026-03-10',
    summary: 'A definitive guide on transactional integrity vs horizontal scalability, B-Tree vs LSM-Tree storage engines, and multi-model database design.',
    whyItExists: 'Data storage is the foundation of every backend software application. Choosing the wrong database type early in a system architecture often leads to painful migrations, data inconsistency, and bottlenecked scaling. Understanding relational constraints versus document and key-value paradigms allows engineers to make justified, mathematically sound decisions.',
    industryArchitecture: 'Relational databases (like PostgreSQL and MySQL) use B-Trees for structured tables, enforcing ACID (Atomicity, Consistency, Isolation, Durability) guarantees through write-ahead logging (WAL). NoSQL databases (like Cassandra, DynamoDB, and MongoDB) trade strong multi-table consistency for horizontal partition tolerance (CAP theorem), utilizing Log-Structured Merge (LSM) trees and consistent hash rings for distributed writes.',
    sections: [
      {
        id: 'acid-vs-base',
        title: '1. ACID vs BASE Architectural Philosophy',
        content: 'SQL databases prioritize strict consistency (ACID). Every transaction is guaranteed to either succeed completely or roll back, with strict isolation levels. NoSQL systems frequently adopt BASE (Basically Available, Soft state, Eventual consistency), where nodes synchronize updates asynchronously over time to maximize uptime across distributed data centers.',
      },
      {
        id: 'indexing-b-trees',
        title: '2. B-Tree vs LSM-Tree Storage Engines',
        content: 'Traditional RDBMS like PostgreSQL use B+ Trees, which optimize for read-heavy workloads by maintaining balanced tree structures on disk with O(log N) lookups. In contrast, LSM Trees (used in Cassandra, RocksDB, and ScyllaDB) append all writes sequentially to an in-memory MemTable and flush to SSTables on disk, making them 10x faster for write-heavy logging or telemetry workloads.',
      }
    ],
    interviewQuestions: [
      {
        question: 'Explain the CAP Theorem and give a real-world scenario where you would choose Availability over Consistency.',
        idealAnswer: 'The CAP theorem states that a distributed data store can simultaneously provide only two of three guarantees: Consistency (every read gets the latest write), Availability (every non-failing node returns a response), and Partition Tolerance (system continues functioning despite network drops). In a social media feed or e-commerce shopping cart, Availability is preferred over strict immediate consistency (AP), because showing slightly stale posts or allowing carts to merge later is better than taking the application down during a network partition.'
      }
    ],
    resumeBulletPoints: [
      'Designed scalable hybrid data architectures combining PostgreSQL for ACID transaction integrity and Redis for sub-millisecond session caching.',
      'Optimized database query performance by 65% through composite B-Tree indexing, execution plan analysis (EXPLAIN ANALYZE), and connection pool tuning.'
    ]
  },
  {
    slug: 'jwt-authentication-and-security',
    title: 'Modern Web Authentication: JWTs, Refresh Tokens & Session Security',
    subtitle: 'Defeating XSS and CSRF attacks, HTTP-only secure cookie strategies, and token rotation.',
    category: 'security',
    readTime: '11 min read',
    difficulty: 'Intermediate',
    tags: ['Security', 'Authentication', 'JWT', 'OAuth2', 'Web Security'],
    publishedDate: '2026-03-05',
    summary: 'How modern production web apps implement stateless authentication, prevent token theft, and manage secure session lifecycles.',
    whyItExists: 'Stateless JSON Web Tokens (JWTs) revolutionized distributed authentication by eliminating server-side session lookup databases. However, improper token storage (like placing tokens in localStorage where they are vulnerable to cross-site scripting/XSS) has caused widespread security breaches across modern single-page applications.',
    industryArchitecture: 'Modern security best practices employ a dual-token architecture: a short-lived (10-15 min) JWT Access Token held in JavaScript memory, and a long-lived (7-30 day) Refresh Token stored in a SameSite=Strict, HttpOnly, Secure cookie. When the access token expires, a background silent refresh endpoint issues a new access token while rotating the refresh token in the database to detect token replay attacks.',
    sections: [
      {
        id: 'dual-token-architecture',
        title: '1. Implementing the Dual-Token Rotation Pattern',
        content: 'Storing JWTs in localStorage exposes authentication credentials to any malicious third-party script or npm dependency via Cross-Site Scripting (XSS). Storing tokens in plain cookies exposes them to Cross-Site Request Forgery (CSRF). The gold standard solution is holding access tokens in memory (React state) and using HttpOnly cookies with CSRF tokens for refresh operations.',
        codeSnippet: {
          language: 'typescript',
          code: `// Setting secure HTTP-only refresh cookie in Node.js / Express
res.cookie('refreshToken', token, {
  httpOnly: true, // Prevents JavaScript access (XSS defense)
  secure: process.env.NODE_ENV === 'production', // HTTPS only
  sameSite: 'strict', // CSRF defense
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});`
        }
      }
    ],
    interviewQuestions: [
      {
        question: 'Why should you never store sensitive JWT access tokens in localStorage?',
        idealAnswer: 'localStorage has no access restrictions for JavaScript running on the same domain. If your application or any third-party script (analytics, ad tag, npm package) is vulnerable to Cross-Site Scripting (XSS), an attacker can execute `localStorage.getItem("token")` and exfiltrate the user credentials. Storing tokens in HttpOnly cookies ensures that client-side JavaScript cannot read or steal the token.'
      }
    ],
    resumeBulletPoints: [
      'Implemented secure dual-token authentication flow using short-lived in-memory JWTs and HttpOnly SameSite=Strict refresh cookies, eliminating XSS token vulnerabilities.',
      'Engineered automatic token rotation and replay-attack detection with zero-downtime silent session refreshes.'
    ]
  }
];

export function getGuideBySlug(slug: string): TechnicalGuide | undefined {
  return technicalGuides.find((g) => g.slug === slug);
}

export interface CsConcept {
  id: string;
  title: string;
  keyPoints: string[];
  commonQuestions: string[];
}

export interface CsSubtopic {
  id: string;
  title: string;
  concepts: CsConcept[];
}

export interface CsSubject {
  id: string;
  title: string;
  icon: string;
  subtopics: CsSubtopic[];
}

export const csSubjects: CsSubject[] = [
  {
    id: 'os',
    title: 'Operating Systems',
    icon: 'Monitor',
    subtopics: [
      {
        id: 'os-process',
        title: 'Process Management',
        concepts: [
          {
            id: 'os-process-basics',
            title: 'Process vs Thread',
            keyPoints: [
              'A process is an instance of a program in execution with its own address space',
              'A thread is a lightweight unit of execution within a process sharing the same address space',
              'Context switching between processes is expensive; between threads is cheaper',
              'Threads share code, data, and files but have their own stack and registers',
            ],
            commonQuestions: [
              'What is the difference between a process and a thread?',
              'Why is context switching between threads faster than between processes?',
              'Can two threads of the same process run on different cores?',
            ],
          },
          {
            id: 'os-process-states',
            title: 'Process States & Lifecycle',
            keyPoints: [
              'States: New → Ready → Running → Waiting → Terminated',
              'Process Control Block (PCB) stores process state, PC, registers, memory info',
              'Fork creates a child process (copy of parent); exec replaces process image',
              'Zombie process: terminated but parent hasn\'t called wait(); Orphan: parent terminated first',
            ],
            commonQuestions: [
              'Explain the process state diagram with transitions',
              'What is a zombie process and how do you prevent it?',
              'What happens when you call fork()?',
            ],
          },
          {
            id: 'os-scheduling',
            title: 'CPU Scheduling',
            keyPoints: [
              'FCFS: Simple but suffers from convoy effect',
              'SJF: Optimal average wait time but requires knowing burst time',
              'Round Robin: Time quantum based, good for time-sharing systems',
              'Priority Scheduling: Can cause starvation; solved by aging',
              'Multilevel Queue: Different queues for different process types',
            ],
            commonQuestions: [
              'Compare FCFS, SJF, and Round Robin scheduling',
              'What is starvation and how does aging solve it?',
              'What is the convoy effect in FCFS?',
            ],
          },
          {
            id: 'os-ipc',
            title: 'Inter-Process Communication',
            keyPoints: [
              'Shared Memory: Fast but requires synchronization (semaphores/mutexes)',
              'Message Passing: Easier to implement, works across networks',
              'Pipes: Unidirectional (anonymous) or bidirectional (named/FIFO)',
              'Sockets: Communication between processes on different machines',
            ],
            commonQuestions: [
              'Compare shared memory vs message passing',
              'What is the difference between named and unnamed pipes?',
              'How do you handle race conditions in shared memory?',
            ],
          },
        ],
      },
      {
        id: 'os-sync',
        title: 'Synchronization',
        concepts: [
          {
            id: 'os-critical-section',
            title: 'Critical Section Problem',
            keyPoints: [
              'Three requirements: Mutual Exclusion, Progress, Bounded Waiting',
              'Peterson\'s Solution works for 2 processes using turn and flag variables',
              'Hardware solutions: Test-and-Set, Compare-and-Swap (atomic operations)',
              'Critical section must be as short as possible to minimize contention',
            ],
            commonQuestions: [
              'What are the three conditions for a valid critical section solution?',
              'Explain Peterson\'s algorithm',
              'What is a race condition? Give an example.',
            ],
          },
          {
            id: 'os-semaphores',
            title: 'Semaphores & Mutex',
            keyPoints: [
              'Binary semaphore (0/1) works like a mutex for mutual exclusion',
              'Counting semaphore allows N concurrent accesses to a resource',
              'wait()/P() decrements; signal()/V() increments the semaphore',
              'Mutex has ownership — only the thread that locked it can unlock it',
            ],
            commonQuestions: [
              'Difference between binary semaphore and mutex?',
              'Solve the producer-consumer problem using semaphores',
              'What is priority inversion?',
            ],
          },
          {
            id: 'os-deadlock',
            title: 'Deadlocks',
            keyPoints: [
              'Four conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
              'Prevention: Break any one of the four conditions',
              'Avoidance: Banker\'s Algorithm checks safe state before allocation',
              'Detection: Resource Allocation Graph (RAG) — cycle = deadlock',
              'Recovery: Process termination or resource preemption',
            ],
            commonQuestions: [
              'What are the necessary conditions for deadlock?',
              'Explain Banker\'s Algorithm with an example',
              'How is deadlock different from starvation?',
            ],
          },
        ],
      },
      {
        id: 'os-memory',
        title: 'Memory Management',
        concepts: [
          {
            id: 'os-mem-basics',
            title: 'Memory Allocation',
            keyPoints: [
              'Contiguous: First Fit, Best Fit, Worst Fit allocation strategies',
              'External fragmentation: Free memory scattered in small blocks',
              'Internal fragmentation: Allocated memory larger than needed',
              'Compaction eliminates external fragmentation but is expensive',
            ],
            commonQuestions: [
              'Compare First Fit, Best Fit, and Worst Fit',
              'Difference between internal and external fragmentation',
              'What is compaction?',
            ],
          },
          {
            id: 'os-paging',
            title: 'Paging',
            keyPoints: [
              'Divides physical memory into fixed-size frames and logical memory into pages',
              'Page table maps logical page number to physical frame number',
              'TLB (Translation Lookaside Buffer) caches recent page table entries',
              'Multi-level page tables reduce memory overhead for large address spaces',
              'No external fragmentation; may have internal fragmentation in last page',
            ],
            commonQuestions: [
              'How does address translation work in paging?',
              'What is a TLB and why is it needed?',
              'What is a page fault? What happens when one occurs?',
            ],
          },
          {
            id: 'os-virtual-mem',
            title: 'Virtual Memory',
            keyPoints: [
              'Allows processes to use more memory than physically available',
              'Demand Paging: Pages loaded only when needed (lazy loading)',
              'Page replacement: FIFO, LRU, Optimal, Clock algorithm',
              'Thrashing: Excessive page faults causing system to spend more time swapping than executing',
              'Working Set Model: Keep frequently used pages in memory',
            ],
            commonQuestions: [
              'What is thrashing and how do you prevent it?',
              'Compare LRU and FIFO page replacement',
              'What is Belady\'s anomaly?',
            ],
          },
          {
            id: 'os-segmentation',
            title: 'Segmentation',
            keyPoints: [
              'Divides memory into variable-size segments (code, data, stack, heap)',
              'Each segment has a base address and limit',
              'Supports user\'s view of memory (logical grouping)',
              'Can be combined with paging (segmented paging)',
            ],
            commonQuestions: [
              'Difference between paging and segmentation?',
              'What is segmentation fault?',
              'Can paging and segmentation be combined?',
            ],
          },
        ],
      },
      {
        id: 'os-storage',
        title: 'Storage & File Systems',
        concepts: [
          {
            id: 'os-disk-scheduling',
            title: 'Disk Scheduling',
            keyPoints: [
              'FCFS: Simple, fair but inefficient seek time',
              'SSTF: Shortest Seek Time First — better performance but may cause starvation',
              'SCAN (Elevator): Moves in one direction serving requests, then reverses',
              'C-SCAN: Circular SCAN — serves only in one direction, jumps back to start',
              'LOOK/C-LOOK: Like SCAN/C-SCAN but reverses at last request, not disk end',
            ],
            commonQuestions: [
              'Compare SCAN, C-SCAN, and SSTF disk scheduling',
              'Why is SSTF prone to starvation?',
              'What is the elevator algorithm?',
            ],
          },
          {
            id: 'os-file-system',
            title: 'File System Basics',
            keyPoints: [
              'File allocation: Contiguous, Linked, Indexed',
              'Directory structures: Single-level, Two-level, Tree, Acyclic graph',
              'Inode stores metadata: size, owner, permissions, pointers to data blocks',
              'Journaling (ext4, NTFS) prevents corruption on crash by logging changes first',
            ],
            commonQuestions: [
              'Compare contiguous, linked, and indexed file allocation',
              'What is an inode?',
              'How does journaling prevent data corruption?',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'dbms',
    title: 'DBMS',
    icon: 'Database',
    subtopics: [
      {
        id: 'dbms-basics',
        title: 'Fundamentals',
        concepts: [
          {
            id: 'dbms-architecture',
            title: 'DBMS Architecture',
            keyPoints: [
              'Three-schema architecture: External (view), Conceptual (logical), Internal (physical)',
              'Data independence: Logical (change schema without changing external) and Physical (change storage without changing schema)',
              'DBMS provides data abstraction, security, integrity, concurrency control',
              'Query processing: Parsing → Optimization → Execution',
            ],
            commonQuestions: [
              'Explain the three-schema architecture',
              'What is data independence?',
              'Difference between DBMS and file system?',
            ],
          },
          {
            id: 'dbms-keys',
            title: 'Keys in DBMS',
            keyPoints: [
              'Super Key: Any set of attributes that uniquely identifies a tuple',
              'Candidate Key: Minimal super key (no proper subset is a super key)',
              'Primary Key: Chosen candidate key to uniquely identify records',
              'Foreign Key: References primary key of another table (referential integrity)',
              'Composite Key: Key made of multiple attributes',
            ],
            commonQuestions: [
              'Difference between primary key and unique key?',
              'What is referential integrity?',
              'Can a foreign key be NULL?',
            ],
          },
          {
            id: 'dbms-er-model',
            title: 'ER Model',
            keyPoints: [
              'Entities (rectangles), Attributes (ovals), Relationships (diamonds)',
              'Cardinality: 1:1, 1:N, M:N — determines how entities relate',
              'Weak entity depends on a strong entity for identification (double rectangle)',
              'Generalization (bottom-up) vs Specialization (top-down) — IS-A relationship',
            ],
            commonQuestions: [
              'Draw an ER diagram for a university database',
              'What is a weak entity? Give example.',
              'Difference between generalization and specialization?',
            ],
          },
        ],
      },
      {
        id: 'dbms-normal',
        title: 'Normalization',
        concepts: [
          {
            id: 'dbms-functional-dep',
            title: 'Functional Dependencies',
            keyPoints: [
              'X → Y means Y is functionally determined by X',
              'Armstrong\'s Axioms: Reflexivity, Augmentation, Transitivity',
              'Closure of attributes: All attributes determined by a set',
              'Canonical cover: Minimal set of FDs equivalent to original',
            ],
            commonQuestions: [
              'What is a functional dependency?',
              'Find the candidate keys given a set of FDs',
              'What is Armstrong\'s axiom?',
            ],
          },
          {
            id: 'dbms-normal-forms',
            title: 'Normal Forms (1NF to BCNF)',
            keyPoints: [
              '1NF: No multi-valued attributes, atomic values only',
              '2NF: 1NF + no partial dependency (non-prime depends on part of candidate key)',
              '3NF: 2NF + no transitive dependency (non-prime depends on non-prime)',
              'BCNF: For every FD X→Y, X must be a super key (stricter than 3NF)',
              'Decomposition should be lossless-join and dependency-preserving',
            ],
            commonQuestions: [
              'Normalize a given table to 3NF with steps',
              'Difference between 3NF and BCNF?',
              'What is lossless decomposition?',
            ],
          },
        ],
      },
      {
        id: 'dbms-sql',
        title: 'SQL & Relational Algebra',
        concepts: [
          {
            id: 'dbms-sql-basics',
            title: 'SQL Fundamentals',
            keyPoints: [
              'DDL: CREATE, ALTER, DROP, TRUNCATE (schema operations)',
              'DML: SELECT, INSERT, UPDATE, DELETE (data operations)',
              'DCL: GRANT, REVOKE (permissions)',
              'TCL: COMMIT, ROLLBACK, SAVEPOINT (transaction control)',
              'GROUP BY with HAVING vs WHERE: WHERE filters rows, HAVING filters groups',
            ],
            commonQuestions: [
              'Difference between DELETE and TRUNCATE?',
              'Write a query to find second highest salary',
              'Difference between WHERE and HAVING?',
            ],
          },
          {
            id: 'dbms-joins',
            title: 'Joins',
            keyPoints: [
              'INNER JOIN: Only matching rows from both tables',
              'LEFT JOIN: All rows from left + matching from right (NULLs for no match)',
              'RIGHT JOIN: All rows from right + matching from left',
              'FULL OUTER JOIN: All rows from both tables',
              'CROSS JOIN: Cartesian product of both tables',
              'Self Join: Table joined with itself (e.g., employee-manager)',
            ],
            commonQuestions: [
              'Difference between INNER and OUTER join?',
              'When would you use a self join?',
              'What is a natural join?',
            ],
          },
          {
            id: 'dbms-subquery',
            title: 'Subqueries & Views',
            keyPoints: [
              'Correlated subquery executes once per row of outer query',
              'Non-correlated subquery executes once independently',
              'EXISTS vs IN: EXISTS stops at first match (faster for large datasets)',
              'Views are virtual tables; materialized views store computed results',
            ],
            commonQuestions: [
              'Difference between correlated and non-correlated subquery?',
              'Can you UPDATE through a view?',
              'When to use EXISTS vs IN?',
            ],
          },
        ],
      },
      {
        id: 'dbms-transactions',
        title: 'Transactions & Concurrency',
        concepts: [
          {
            id: 'dbms-acid',
            title: 'ACID Properties',
            keyPoints: [
              'Atomicity: All or nothing — transaction is indivisible',
              'Consistency: DB moves from one valid state to another',
              'Isolation: Concurrent transactions don\'t interfere with each other',
              'Durability: Committed changes persist even after system failure',
              'Maintained using logs (undo/redo) and lock protocols',
            ],
            commonQuestions: [
              'Explain ACID properties with examples',
              'How is atomicity implemented?',
              'What happens if durability is violated?',
            ],
          },
          {
            id: 'dbms-concurrency',
            title: 'Concurrency Control',
            keyPoints: [
              'Problems: Dirty read, Non-repeatable read, Phantom read, Lost update',
              'Lock-based: Shared (read) and Exclusive (write) locks',
              'Two-Phase Locking (2PL): Growing phase (acquire) → Shrinking phase (release)',
              'Strict 2PL: Hold all locks until commit — prevents cascading rollback',
              'Timestamp-based: Each transaction gets a timestamp; ordered by timestamp',
            ],
            commonQuestions: [
              'What is a dirty read?',
              'Explain Two-Phase Locking protocol',
              'Difference between optimistic and pessimistic concurrency control?',
            ],
          },
          {
            id: 'dbms-isolation-levels',
            title: 'Isolation Levels',
            keyPoints: [
              'Read Uncommitted: Lowest isolation, allows dirty reads',
              'Read Committed: Prevents dirty reads',
              'Repeatable Read: Prevents dirty + non-repeatable reads',
              'Serializable: Highest isolation, prevents phantom reads too',
              'Higher isolation = more safety but less concurrency/performance',
            ],
            commonQuestions: [
              'What isolation level does your project use and why?',
              'What is a phantom read?',
              'Trade-offs between isolation levels?',
            ],
          },
        ],
      },
      {
        id: 'dbms-indexing',
        title: 'Indexing & Storage',
        concepts: [
          {
            id: 'dbms-index-types',
            title: 'Index Types',
            keyPoints: [
              'Primary index: Built on primary key, one per table',
              'Secondary index: Built on non-key attributes, can have many',
              'Dense index: Entry for every record; Sparse: entry for each block',
              'B-Tree: Balanced, good for range queries, O(log n) search',
              'B+ Tree: All data in leaf nodes (linked), better for range scans',
              'Hash Index: O(1) lookup but no range queries',
            ],
            commonQuestions: [
              'Difference between B-Tree and B+ Tree?',
              'When would you use a hash index vs B+ tree?',
              'What is a clustered vs non-clustered index?',
            ],
          },
          {
            id: 'dbms-nosql',
            title: 'SQL vs NoSQL',
            keyPoints: [
              'SQL: Structured, ACID, schema-enforced, vertical scaling (relational)',
              'NoSQL: Flexible schema, BASE properties, horizontal scaling',
              'Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j)',
              'CAP Theorem: Can only guarantee 2 of Consistency, Availability, Partition Tolerance',
            ],
            commonQuestions: [
              'When would you choose NoSQL over SQL?',
              'Explain CAP theorem with examples',
              'What are BASE properties?',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cn',
    title: 'Computer Networks',
    icon: 'Globe',
    subtopics: [
      {
        id: 'cn-models',
        title: 'Network Models',
        concepts: [
          {
            id: 'cn-osi',
            title: 'OSI Model (7 Layers)',
            keyPoints: [
              'Physical: Bits over wire (hubs, cables)',
              'Data Link: Frames, MAC address, error detection (switches)',
              'Network: Packets, IP addressing, routing (routers)',
              'Transport: Segments, port numbers, TCP/UDP',
              'Session: Manages connections/sessions',
              'Presentation: Encryption, compression, data format',
              'Application: HTTP, FTP, SMTP, DNS — user-facing protocols',
            ],
            commonQuestions: [
              'Explain all 7 layers of OSI with examples',
              'Which layer does a router operate at?',
              'Difference between OSI and TCP/IP model?',
            ],
          },
          {
            id: 'cn-tcpip',
            title: 'TCP/IP Model',
            keyPoints: [
              '4 layers: Network Access, Internet, Transport, Application',
              'More practical than OSI — used in actual internet',
              'Internet layer = Network layer (IP protocol)',
              'Network Access = Physical + Data Link of OSI',
            ],
            commonQuestions: [
              'Map OSI layers to TCP/IP model',
              'Why is TCP/IP preferred over OSI in practice?',
              'Which protocols operate at each TCP/IP layer?',
            ],
          },
        ],
      },
      {
        id: 'cn-datalink',
        title: 'Data Link Layer',
        concepts: [
          {
            id: 'cn-mac',
            title: 'MAC & Framing',
            keyPoints: [
              'MAC address: 48-bit hardware address (unique per NIC)',
              'Framing: Character count, byte stuffing, bit stuffing',
              'Error detection: Parity, CRC (Cyclic Redundancy Check), Checksum',
              'Error correction: Hamming code can detect 2-bit and correct 1-bit errors',
            ],
            commonQuestions: [
              'What is the difference between MAC and IP address?',
              'How does CRC work?',
              'Difference between error detection and correction?',
            ],
          },
          {
            id: 'cn-access-control',
            title: 'Multiple Access Protocols',
            keyPoints: [
              'ALOHA: Pure (18%) and Slotted (37%) efficiency',
              'CSMA: Listen before transmit; CSMA/CD (Ethernet), CSMA/CA (WiFi)',
              'Token Ring: Only token holder can transmit — no collision',
              'Ethernet (802.3): CSMA/CD, uses exponential backoff on collision',
            ],
            commonQuestions: [
              'Difference between CSMA/CD and CSMA/CA?',
              'Why is CSMA/CA used in wireless?',
              'What is exponential backoff?',
            ],
          },
        ],
      },
      {
        id: 'cn-network',
        title: 'Network Layer',
        concepts: [
          {
            id: 'cn-ip-addressing',
            title: 'IP Addressing & Subnetting',
            keyPoints: [
              'IPv4: 32-bit address, dotted decimal (4 octets)',
              'Classes: A (1-126), B (128-191), C (192-223), D (multicast), E (reserved)',
              'Subnet mask divides network and host portions',
              'CIDR: Classless routing — /24 means 24 network bits',
              'Private IPs: 10.x.x.x, 172.16-31.x.x, 192.168.x.x (NAT needed for internet)',
              'IPv6: 128-bit address, colon-hex notation, no NAT needed',
            ],
            commonQuestions: [
              'Given a CIDR block, find number of hosts and subnet mask',
              'What is NAT and why is it needed?',
              'Difference between IPv4 and IPv6?',
            ],
          },
          {
            id: 'cn-routing',
            title: 'Routing Algorithms',
            keyPoints: [
              'Distance Vector: Bellman-Ford, each router knows distance to neighbors (RIP)',
              'Link State: Dijkstra, each router has full topology map (OSPF)',
              'Count-to-infinity problem in distance vector — solved by split horizon, poison reverse',
              'BGP: Border Gateway Protocol — inter-AS routing on the internet',
            ],
            commonQuestions: [
              'Compare distance vector and link state routing',
              'What is count-to-infinity problem?',
              'Difference between RIP and OSPF?',
            ],
          },
        ],
      },
      {
        id: 'cn-transport',
        title: 'Transport Layer',
        concepts: [
          {
            id: 'cn-tcp-udp',
            title: 'TCP vs UDP',
            keyPoints: [
              'TCP: Connection-oriented, reliable, ordered, flow/congestion control',
              'UDP: Connectionless, unreliable, no ordering, fast (low overhead)',
              'TCP uses 3-way handshake: SYN → SYN-ACK → ACK',
              'TCP uses sequence numbers for ordering and ACKs for reliability',
              'UDP used for: DNS, streaming, gaming, VoIP (latency-sensitive)',
            ],
            commonQuestions: [
              'When would you use UDP over TCP?',
              'Explain TCP 3-way handshake',
              'How does TCP ensure reliable delivery?',
            ],
          },
          {
            id: 'cn-flow-control',
            title: 'Flow & Congestion Control',
            keyPoints: [
              'Flow control (TCP): Sliding window — receiver advertises window size',
              'Congestion control: Slow Start → Congestion Avoidance → Fast Recovery',
              'Slow Start: Exponential growth of cwnd until threshold',
              'Congestion Avoidance: Linear growth after threshold (additive increase)',
              'Fast Retransmit: Retransmit after 3 duplicate ACKs without waiting for timeout',
            ],
            commonQuestions: [
              'Explain TCP slow start and congestion avoidance',
              'Difference between flow control and congestion control?',
              'What triggers fast retransmit?',
            ],
          },
        ],
      },
      {
        id: 'cn-application',
        title: 'Application Layer',
        concepts: [
          {
            id: 'cn-dns',
            title: 'DNS',
            keyPoints: [
              'Translates domain names to IP addresses',
              'Hierarchy: Root → TLD (.com) → Authoritative → Local resolver',
              'Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver)',
              'Recursive vs Iterative query: Recursive does full resolution; iterative returns referral',
              'DNS caching reduces lookup time (TTL-based)',
            ],
            commonQuestions: [
              'What happens when you type google.com in browser? (DNS part)',
              'Difference between recursive and iterative DNS query?',
              'What is DNS cache poisoning?',
            ],
          },
          {
            id: 'cn-http',
            title: 'HTTP & HTTPS',
            keyPoints: [
              'HTTP: Stateless, request-response protocol on port 80',
              'Methods: GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update)',
              'Status codes: 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error)',
              'HTTP/2: Multiplexing, header compression, server push',
              'HTTPS = HTTP + TLS/SSL encryption (port 443)',
              'Cookies/Sessions/JWT used to maintain state',
            ],
            commonQuestions: [
              'Difference between HTTP and HTTPS?',
              'What is the difference between PUT and PATCH?',
              'How does a TLS handshake work?',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'oops',
    title: 'OOPs',
    icon: 'Boxes',
    subtopics: [
      {
        id: 'oops-basics',
        title: 'Core Concepts',
        concepts: [
          {
            id: 'oops-class-object',
            title: 'Class & Object',
            keyPoints: [
              'Class is a blueprint/template; Object is an instance of a class',
              'Class defines attributes (data) and methods (behavior)',
              'Constructor initializes object state; Destructor cleans up resources',
              'this/self refers to the current object instance',
            ],
            commonQuestions: [
              'Difference between class and object?',
              'What is the purpose of a constructor?',
              'Can a class have multiple constructors? (Overloading)',
            ],
          },
          {
            id: 'oops-encapsulation',
            title: 'Encapsulation',
            keyPoints: [
              'Bundling data and methods that operate on that data within a class',
              'Access modifiers: public, private, protected control visibility',
              'Getters/setters provide controlled access to private fields',
              'Hides internal implementation details — only exposes necessary interface',
            ],
            commonQuestions: [
              'What is encapsulation and why is it important?',
              'Difference between abstraction and encapsulation?',
              'When would you use private vs protected?',
            ],
          },
          {
            id: 'oops-abstraction',
            title: 'Abstraction',
            keyPoints: [
              'Showing only essential details, hiding implementation complexity',
              'Abstract class: Can have both abstract and concrete methods; cannot be instantiated',
              'Interface: Pure contract — only method signatures (in Java/C#), multiple inheritance allowed',
              'Real-world analogy: Driving a car — you use pedals/wheel without knowing engine internals',
            ],
            commonQuestions: [
              'Difference between abstract class and interface?',
              'When to use abstract class vs interface?',
              'Can an abstract class have a constructor?',
            ],
          },
        ],
      },
      {
        id: 'oops-inheritance',
        title: 'Inheritance',
        concepts: [
          {
            id: 'oops-inherit-types',
            title: 'Types of Inheritance',
            keyPoints: [
              'Single: One class inherits from one parent',
              'Multilevel: A → B → C chain of inheritance',
              'Hierarchical: Multiple classes inherit from one parent',
              'Multiple: One class inherits from multiple parents (supported in C++, not Java)',
              'Hybrid: Combination of two or more types',
              'Diamond problem in multiple inheritance — solved by virtual inheritance (C++) or interfaces (Java)',
            ],
            commonQuestions: [
              'Why doesn\'t Java support multiple inheritance with classes?',
              'What is the diamond problem?',
              'Difference between IS-A and HAS-A relationship?',
            ],
          },
          {
            id: 'oops-overriding',
            title: 'Method Overriding vs Overloading',
            keyPoints: [
              'Overloading: Same method name, different parameters (compile-time polymorphism)',
              'Overriding: Subclass redefines parent\'s method with same signature (runtime polymorphism)',
              'Overriding requires inheritance; overloading works within same class',
              'Virtual functions (C++) / @Override (Java) enable runtime dispatch',
            ],
            commonQuestions: [
              'Difference between overloading and overriding?',
              'Can we override static methods?',
              'What is method hiding?',
            ],
          },
        ],
      },
      {
        id: 'oops-polymorphism',
        title: 'Polymorphism',
        concepts: [
          {
            id: 'oops-compile-time',
            title: 'Compile-Time Polymorphism',
            keyPoints: [
              'Also called static binding or early binding',
              'Achieved via function overloading and operator overloading',
              'Decision made at compile time based on function signature',
              'Faster than runtime polymorphism (no vtable lookup)',
            ],
            commonQuestions: [
              'What is compile-time polymorphism? Give examples.',
              'How does the compiler resolve overloaded functions?',
              'What is operator overloading?',
            ],
          },
          {
            id: 'oops-runtime',
            title: 'Runtime Polymorphism',
            keyPoints: [
              'Also called dynamic binding or late binding',
              'Achieved via method overriding and virtual functions',
              'Uses vtable (virtual table) for dynamic dispatch in C++',
              'Allows treating objects of different classes uniformly through base class pointer/reference',
            ],
            commonQuestions: [
              'What is a virtual function?',
              'How does vtable work internally?',
              'What is a pure virtual function?',
            ],
          },
        ],
      },
      {
        id: 'oops-advanced',
        title: 'Advanced OOP',
        concepts: [
          {
            id: 'oops-solid',
            title: 'SOLID Principles',
            keyPoints: [
              'S: Single Responsibility — class should have one reason to change',
              'O: Open/Closed — open for extension, closed for modification',
              'L: Liskov Substitution — subclass should be substitutable for parent',
              'I: Interface Segregation — many small interfaces > one large interface',
              'D: Dependency Inversion — depend on abstractions, not concretions',
            ],
            commonQuestions: [
              'Explain each SOLID principle with an example',
              'Give a code example that violates Liskov Substitution',
              'How does Dependency Inversion help in testing?',
            ],
          },
          {
            id: 'oops-design-patterns',
            title: 'Design Patterns (Key Ones)',
            keyPoints: [
              'Singleton: Only one instance of a class globally',
              'Factory: Creates objects without exposing creation logic',
              'Observer: One-to-many dependency — subjects notify observers of changes',
              'Strategy: Encapsulate algorithms, make them interchangeable',
              'Decorator: Add behavior to objects dynamically without modifying class',
            ],
            commonQuestions: [
              'Implement Singleton pattern (thread-safe)',
              'When would you use Factory over direct instantiation?',
              'Explain Observer pattern with a real example',
            ],
          },
          {
            id: 'oops-misc',
            title: 'Miscellaneous',
            keyPoints: [
              'Composition over Inheritance: Prefer HAS-A over IS-A for flexibility',
              'Shallow copy: Copies references; Deep copy: Copies actual objects recursively',
              'Object slicing: Derived object assigned to base loses derived data (C++)',
              'Friend functions (C++): Access private members without being a member',
              'final/sealed class: Cannot be inherited further',
            ],
            commonQuestions: [
              'Why prefer composition over inheritance?',
              'Difference between shallow and deep copy?',
              'What is object slicing?',
            ],
          },
        ],
      },
    ],
  },
];

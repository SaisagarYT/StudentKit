export interface DsaTopicMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  pattern: string;
}

export const dsaTopicsMeta: DsaTopicMeta[] = [
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    description: 'Foundation of DSA — master array traversals, hash maps, frequency counting, and prefix techniques.',
    icon: 'grid-3x3',
    pattern: 'Use hash maps for O(1) lookups, prefix sums for range queries, and sorting + two pointers for pair problems.',
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    description: 'Efficiently solve problems using two converging or diverging pointers — eliminates unnecessary nested loops.',
    icon: 'arrow-left-right',
    pattern: 'Sort the array first, then use left/right pointers moving inward. For linked lists, use slow/fast pointers.',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    description: 'Maintain a dynamic window over data to solve substring and subarray problems in linear time.',
    icon: 'panel-right-open',
    pattern: 'Expand window right, shrink from left when condition breaks. Track state with a hash map or counter.',
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'Last-in-first-out data structure — essential for parsing expressions, monotonic patterns, and backtracking.',
    icon: 'layers',
    pattern: 'Use monotonic stack for next-greater-element patterns. Stack is ideal when you need to match pairs or process in reverse order.',
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Divide-and-conquer search over sorted or monotonic spaces — reduces O(n) to O(log n).',
    icon: 'search',
    pattern: 'Identify the monotonic property. Binary search on answer space when direct search is unclear. Handle edge cases with lo <= hi vs lo < hi carefully.',
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'Dynamic linear data structure — practice pointer manipulation, reversal, and cycle detection.',
    icon: 'link',
    pattern: 'Use dummy head nodes for edge cases. Fast/slow pointers for cycle detection and finding middle. Reverse in-place with prev/curr/next.',
  },
  {
    id: 'trees',
    title: 'Trees',
    description: 'Hierarchical data structures — binary trees, BSTs, and traversal techniques are interview staples.',
    icon: 'git-branch',
    pattern: 'Think recursively: base case (null node) + recursive case. DFS (pre/in/post-order) vs BFS (level-order). BST property: left < root < right.',
  },
  {
    id: 'tries',
    title: 'Tries',
    description: 'Prefix tree data structure — optimized for string searching, autocomplete, and word games.',
    icon: 'text-search',
    pattern: 'Each node has up to 26 children (a-z). Insert character by character. Use a flag to mark end-of-word. Combine with DFS for word search.',
  },
  {
    id: 'heap-priority-queue',
    title: 'Heap / Priority Queue',
    description: 'Efficiently find min/max elements — critical for scheduling, streaming data, and top-K problems.',
    icon: 'bar-chart-3',
    pattern: 'Use min-heap for "K largest" and max-heap for "K smallest". Two heaps (max + min) for running median. O(log n) insert/extract.',
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description: 'Explore all possibilities through recursive choice-making — fundamental for combinatorial problems.',
    icon: 'undo-2',
    pattern: 'Template: choose → explore → unchoose. Prune early to avoid TLE. Sort input first for duplicate handling. Use visited set for grid problems.',
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Model relationships between entities — master BFS, DFS, topological sort, shortest path, and union-find.',
    icon: 'share-2',
    pattern: 'BFS for shortest path (unweighted), DFS for connected components and cycles. Topological sort for dependencies. Union-Find for dynamic connectivity.',
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description: 'Break complex problems into overlapping subproblems — the most frequently tested advanced topic.',
    icon: 'brain',
    pattern: '1D DP: define dp[i] = answer for first i items. 2D DP: dp[i][j] for two constraints. Identify state, transition, base case. Optimize space with rolling arrays.',
  },
  {
    id: 'greedy',
    title: 'Greedy',
    description: 'Make locally optimal choices to find global optima — requires proving greedy choice property.',
    icon: 'zap',
    pattern: 'Sort by end time for interval scheduling. Sort by start for merging. Greedy works when local optimal leads to global optimal — prove or verify with examples.',
  },
  {
    id: 'intervals',
    title: 'Intervals',
    description: 'Merge, insert, and manage overlapping ranges — common in scheduling and calendar problems.',
    icon: 'git-merge',
    pattern: 'Sort intervals by start time. Merge if current.start <= prev.end. For min meeting rooms, use a min-heap of end times.',
  },
  {
    id: 'math-bit-manipulation',
    title: 'Math & Bit Manipulation',
    description: 'Low-level operations and mathematical tricks — XOR, bit shifting, and number theory fundamentals.',
    icon: 'calculator',
    pattern: 'XOR: a^a=0, a^0=a — find unique elements. Bit masking for subsets. Check bit: n & (1<<i). Common: n&(n-1) removes lowest set bit.',
  },
];

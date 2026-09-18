'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Code2,
  ExternalLink,
  Video,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Building2,
  Sparkles,
  Columns2,
  Eye,
  Edit3,
  Lightbulb,
  BookOpen,
  Compass,
  Clock,
  HardDrive,
  MoveUp,
  MoveDown,
  ChevronDown,
} from 'lucide-react';
import { dsaProblemRepository } from '@/lib/cms/repository';
import { useAuth } from '@/lib/firebase/auth';
import { dsaTopicsMeta } from '@/config/placement/dsa-topics';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type {
  DsaCategory,
  DsaDifficulty,
  ContentStatus,
  DsaApproach,
  DsaResource,
  DsaProblemListItem,
} from '@/lib/cms/types';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { DsaSolutionView } from '@/features/placement/dsa/components/dsa-solution-drawer';

interface DsaProblemFormProps {
  mode: 'create' | 'edit';
  problemId?: string;
}

const DIFFICULTIES: { value: DsaDifficulty; label: string; color: string; border: string }[] = [
  { value: 'easy', label: 'Easy', color: 'text-emerald-400 bg-emerald-500/10', border: 'border-emerald-500/30' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/30' },
  { value: 'hard', label: 'Hard', color: 'text-rose-400 bg-rose-500/10', border: 'border-rose-500/30' },
];

const CURATED_LISTS_OPTIONS = [
  { id: 'blind-75', label: 'Blind 75' },
  { id: 'neetcode-150', label: 'NeetCode 150' },
  { id: 'faang-50', label: 'FAANG Top 50' },
  { id: 'striver-sde', label: 'Striver SDE Sheet' },
];

const COMMON_COMPANIES = [
  'Google',
  'Amazon',
  'Meta',
  'Microsoft',
  'Apple',
  'Netflix',
  'Uber',
  'Bloomberg',
  'Goldman Sachs',
  'Adobe',
  'Salesforce',
  'LinkedIn',
  'Atlassian',
];

type LangTab = 'python' | 'javascript' | 'cpp' | 'java';

const LANG_CONFIG: Record<
  LangTab,
  { label: string; placeholder: string; defaultTemplate: string }
> = {
  python: {
    label: 'Python 3',
    placeholder: 'def solution(nums, target):\n    # Write clean Python solution...',
    defaultTemplate: `def solution(nums: list[int], target: int) -> int:
    # 1. State / Data structures
    seen = {}
    
    # 2. Iterate and check conditions
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return seen[complement]
        seen[num] = i
        
    return -1`,
  },
  javascript: {
    label: 'JavaScript / TS',
    placeholder: 'function solution(nums, target) {\n  // Write JavaScript solution...\n}',
    defaultTemplate: `function solution(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  cpp: {
    label: 'C++',
    placeholder: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    // ...\n};',
    defaultTemplate: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        unordered_map<int, int> lookup;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (lookup.count(complement)) {
                return {lookup[complement], i};
            }
            lookup[nums[i]] = i;
        }
        return {};
    }
};`,
  },
  java: {
    label: 'Java',
    placeholder: 'import java.util.*;\n\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        // ...\n    }\n}',
    defaultTemplate: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] solve(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  },
};

export function DsaProblemForm({ mode, problemId }: DsaProblemFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Studio Mode: 'edit' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');

  // Core problem fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<DsaDifficulty>('medium');
  const [category, setCategory] = useState<DsaCategory>('arrays-hashing');
  const [link, setLink] = useState('');
  const [videoSolution, setVideoSolution] = useState('');
  const [status, setStatus] = useState<ContentStatus>('published');
  const [order, setOrder] = useState(0);

  // Dynamic Multi-Approach Solutions
  const [approaches, setApproaches] = useState<DsaApproach[]>([
    {
      id: 'app-1',
      title: 'Approach 1: Brute Force',
      tag: 'brute-force',
      intuition:
        'Start with the naive implementation to establish the correctness baseline and understand why nested iteration is suboptimal.',
      timeComplexity: 'O(N²)',
      spaceComplexity: 'O(1)',
      codeSolutions: {
        python: LANG_CONFIG.python.defaultTemplate,
        javascript: LANG_CONFIG.javascript.defaultTemplate,
        cpp: LANG_CONFIG.cpp.defaultTemplate,
        java: LANG_CONFIG.java.defaultTemplate,
      },
      explanationAfterCode:
        '### Dry Run & Walkthrough\nWalk through a small sample input step-by-step. Notice the repeated checks that motivate an optimal data structure.',
    },
    {
      id: 'app-2',
      title: 'Approach 2: Optimal Hash Map',
      tag: 'optimal',
      intuition:
        'Trade space for time by caching previous items in a hash map. This converts the linear lookup into an instant O(1) expected time check.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      codeSolutions: {
        python: LANG_CONFIG.python.defaultTemplate,
        javascript: LANG_CONFIG.javascript.defaultTemplate,
        cpp: LANG_CONFIG.cpp.defaultTemplate,
        java: LANG_CONFIG.java.defaultTemplate,
      },
      explanationAfterCode:
        '### Complexity & Gotchas\n- Be careful about self-matching or duplicate elements in the map.\n- In languages with potential 32-bit overflow, verify value bounds.',
    },
  ]);

  // Integrated in-DSA resources
  const [resources, setResources] = useState<DsaResource[]>([
    {
      id: 'res-1',
      title: 'Hash Table Collision & Load Factor Visualizer',
      url: 'https://visualgo.net/en/hashtable',
      type: 'visualization',
      description: 'Interactive stepping through open addressing and chaining during key inserts.',
    },
  ]);

  // Progressive hints
  const [hints, setHints] = useState<string[]>([
    'Can you trade space for time? Think about what auxiliary data structure could store values you have already inspected.',
  ]);
  const [newHint, setNewHint] = useState('');

  // Curated lists
  const [curatedLists, setCuratedLists] = useState<string[]>(['blind-75']);

  // Companies & Tags
  const [companies, setCompanies] = useState<string[]>(['Google', 'Amazon']);
  const [companyInput, setCompanyInput] = useState('');
  const [tags, setTags] = useState<string[]>(['hash-table', 'array']);

  // UI States
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [descTab, setDescTab] = useState<'write' | 'preview'>('write');
  const [activeApproachTab, setActiveApproachTab] = useState(0);
  const [approachLangTabs, setApproachLangTabs] = useState<Record<string, LangTab>>({});

  // Load existing data in edit mode
  useEffect(() => {
    if (mode === 'edit' && problemId) {
      dsaProblemRepository
        .getById(problemId)
        .then((prob) => {
          if (prob) {
            setTitle(prob.title);
            setSlug(prob.slug);
            setSlugManual(true);
            setDescription(prob.description || '');
            setDifficulty(prob.difficulty);
            setCategory(prob.category);
            setLink(prob.link || '');
            setVideoSolution(prob.videoSolution || '');
            setStatus(prob.status || 'published');
            setOrder(prob.order || 0);

            // Load approaches or synthesize from legacy fields
            if (prob.approaches && prob.approaches.length > 0) {
              setApproaches(prob.approaches);
            } else {
              setApproaches([
                {
                  id: 'app-legacy',
                  title: 'Approach 1: Optimal Approach',
                  tag: 'optimal',
                  intuition: prob.approach || '',
                  timeComplexity: prob.timeComplexity || 'O(N)',
                  spaceComplexity: prob.spaceComplexity || 'O(1)',
                  codeSolutions: prob.codeSolutions || {},
                  explanationAfterCode: '',
                },
              ]);
            }

            setResources(prob.resources || []);
            setHints(prob.hints || []);
            setCuratedLists(prob.curatedLists || []);
            setCompanies(prob.companies || []);
            setTags(prob.tags || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load problem.');
          setLoading(false);
        });
    }
  }, [mode, problemId]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  // Dynamic Approach Handlers
  const handleAddApproach = () => {
    const nextIdx = approaches.length + 1;
    const newApp: DsaApproach = {
      id: `app-${Date.now()}`,
      title: `Approach ${nextIdx}: New Strategy`,
      tag: nextIdx === 1 ? 'optimal' : 'alternative',
      intuition: 'Describe the core algorithmic insight, invariant, or technique before the code.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      codeSolutions: {
        python: LANG_CONFIG.python.defaultTemplate,
        javascript: LANG_CONFIG.javascript.defaultTemplate,
        cpp: LANG_CONFIG.cpp.defaultTemplate,
        java: LANG_CONFIG.java.defaultTemplate,
      },
      explanationAfterCode: 'Add dry-run steps, step-by-step state traces, or edge cases.',
    };
    setApproaches([...approaches, newApp]);
    setActiveApproachTab(approaches.length);
  };

  const handleUpdateApproach = (index: number, partial: Partial<DsaApproach>) => {
    setApproaches((prev) =>
      prev.map((app, i) => (i === index ? { ...app, ...partial } : app))
    );
  };

  const handleRemoveApproach = (index: number) => {
    if (approaches.length <= 1) {
      alert('A problem must have at least one solution approach.');
      return;
    }
    if (confirm('Are you sure you want to delete this approach?')) {
      const next = approaches.filter((_, i) => i !== index);
      setApproaches(next);
      setActiveApproachTab(Math.max(0, index - 1));
    }
  };

  const handleMoveApproach = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= approaches.length) return;
    const clone = [...approaches];
    const [moved] = clone.splice(index, 1);
    clone.splice(targetIdx, 0, moved);
    setApproaches(clone);
    setActiveApproachTab(targetIdx);
  };

  const handleApproachCodeChange = (approachIdx: number, lang: LangTab, code: string) => {
    setApproaches((prev) =>
      prev.map((app, i) =>
        i === approachIdx
          ? {
              ...app,
              codeSolutions: {
                ...app.codeSolutions,
                [lang]: code,
              },
            }
          : app
      )
    );
  };

  // Resource Handlers
  const handleAddResource = () => {
    const newRes: DsaResource = {
      id: `res-${Date.now()}`,
      title: 'New Study Guide / Visualizer',
      url: 'https://',
      type: 'article',
      description: 'Key takeaways and why students should review this.',
    };
    setResources([...resources, newRes]);
  };

  const handleUpdateResource = (index: number, partial: Partial<DsaResource>) => {
    setResources((prev) =>
      prev.map((res, i) => (i === index ? { ...res, ...partial } : res))
    );
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  // 1-Click Editorial Starter Templates
  const handleApplyTemplate = (templateName: string) => {
    if (!confirm(`Apply the "${templateName}" starter editorial template? Current approaches and descriptions will be initialized with canonical structure.`)) {
      return;
    }

    if (templateName === 'hash-map') {
      setTitle(title || 'Two Sum');
      setCategory('arrays-hashing');
      setDescription(
        `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the same element twice.\n\n### Example 1:\n\`\`\`text\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\`\`\`\n\n### Constraints:\n- \`2 <= nums.length <= 10^4\`\n- \`-10^9 <= nums[i] <= 10^9\`\n- \`-10^9 <= target <= 10^9\``
      );
      setApproaches([
        {
          id: 'app-brute',
          title: 'Approach 1: Brute Force Nested Loop',
          tag: 'brute-force',
          intuition:
            'Iterate through every possible pair `(i, j)` where `i < j` and check if `nums[i] + nums[j] == target`. While straightforward, the quadratic time complexity causes TLE on large arrays.',
          timeComplexity: 'O(N²)',
          spaceComplexity: 'O(1)',
          codeSolutions: {
            python: `def twoSum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
            javascript: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
            cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); ++i) {
        for (int j = i + 1; j < nums.size(); ++j) {
            if (nums[i] + nums[j] == target) return {i, j};
        }
    }
    return {};
}`,
            java: `public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[] { i, j };
        }
    }
    return new int[0];
}`,
          },
          explanationAfterCode:
            '### Complexity Breakdown\n- **Time**: $O(N^2)$ due to $\\frac{N(N-1)}{2}$ comparison iterations.\n- **Space**: $O(1)$ constant space since no auxiliary data structure is allocated.',
        },
        {
          id: 'app-optimal',
          title: 'Approach 2: One-Pass Hash Map (Optimal)',
          tag: 'optimal',
          intuition:
            'We can trade $O(N)$ space for an optimal $O(N)$ runtime. As we scan each number `num`, the complement needed to reach `target` is `diff = target - num`. If `diff` exists in our hash map, we have found our answer; otherwise, store `num -> index`.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          codeSolutions: {
            python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
            javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      return [seen.get(diff), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
            cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.count(diff)) return {seen[diff], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
            java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (seen.containsKey(diff)) {
            return new int[] { seen.get(diff), i };
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
          },
          explanationAfterCode:
            '### Gotchas & Edge Cases\n- **Self Pairing**: Check for complement *before* adding the current element to avoid matching the same index.\n- **Lookup Overhead**: In C++, `unordered_map` has average $O(1)$ lookup time.',
        },
      ]);
      setResources([
        {
          id: 'res-1',
          title: 'Hash Map Internals & Bucket Collisions Guide',
          url: 'https://visualgo.net/en/hashtable',
          type: 'visualization',
          description: 'Visualize how chaining and quadratic probing resolve hash collisions.',
        },
      ]);
    } else if (templateName === 'two-pointers') {
      setTitle(title || 'Valid Palindrome');
      setCategory('two-pointers');
      setDescription(
        `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n### Example 1:\n\`\`\`text\nInput: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.\n\`\`\``
      );
      setApproaches([
        {
          id: 'app-clean',
          title: 'Approach 1: Reverse String Comparison',
          tag: 'alternative',
          intuition:
            'Filter the string to only alphanumeric lowercase characters, create a reversed copy, and check if the original filtered string equals the reversed copy.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          codeSolutions: {
            python: `def isPalindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]`,
            javascript: `function isPalindrome(s) {
  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return clean === clean.split('').reverse().join('');
}`,
            cpp: `bool isPalindrome(string s) {
    string clean = "";
    for (char c : s) if (isalnum(c)) clean += tolower(c);
    string rev = clean;
    reverse(rev.begin(), rev.end());
    return clean == rev;
}`,
            java: `public boolean isPalindrome(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));
    }
    return sb.toString().equals(sb.reverse().toString());
}`,
          },
          explanationAfterCode:
            'Requires allocating memory proportional to the length of string $N$.',
        },
        {
          id: 'app-ptrs',
          title: 'Approach 2: In-Place Two Pointers (Optimal)',
          tag: 'optimal',
          intuition:
            'Use two pointers starting at opposite ends (`left = 0`, `right = n - 1`). Skip non-alphanumeric characters on both ends, compare case-insensitively, and converge inward.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          codeSolutions: {
            python: `def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l += 1; r -= 1
    return True`,
            javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  const isAlphaNum = (c) => /[a-zA-Z0-9]/.test(c);
  while (l < r) {
    while (l < r && !isAlphaNum(s[l])) l++;
    while (l < r && !isAlphaNum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
            cpp: `bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    }
    return true;
}`,
            java: `public boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
        l++; r--;
    }
    return true;
}`,
          },
          explanationAfterCode:
            '### Space Optimization\nOperates strictly in $O(1)$ memory without copying or reversing strings.',
        },
      ]);
    }
  };

  // Save Handler
  const handleSave = async (publishImmediate = false) => {
    if (!user) {
      setError('You must be logged in as admin to save.');
      return;
    }
    if (!title.trim()) {
      setError('Problem title is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required.');
      return;
    }

    setSaving(true);
    setError(null);

    // Primary/Optimal approach fallback for legacy compatibility
    const optimalApp =
      approaches.find((a) => a.tag === 'optimal') || approaches[0] || {
        intuition: '',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        codeSolutions: {},
      };

    // Auto-compile full editorial markdown article from approaches
    const compiledEditorial = [
      `# ${title.trim()}`,
      `> Pattern: **${category.replace(/-/g, ' ')}** | Difficulty: **${difficulty.toUpperCase()}**`,
      '',
      '## Problem Statement',
      description.trim(),
      '',
      '---',
      '',
      '## Algorithmic Approaches',
      ...approaches.map(
        (app, i) => `### ${app.title || `Approach ${i + 1}`} (${app.timeComplexity || 'O(N)'})
${app.intuition || ''}

\`\`\`${'python'}
${app.codeSolutions?.python || '// Python solution'}
\`\`\`

${app.explanationAfterCode || ''}
`
      ),
    ].join('\n\n');

    const problemData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      difficulty,
      category,
      link: link.trim(),
      videoSolution: videoSolution.trim(),
      approach: optimalApp.intuition || '',
      timeComplexity: optimalApp.timeComplexity || 'O(N)',
      spaceComplexity: optimalApp.spaceComplexity || 'O(1)',
      codeSolutions: optimalApp.codeSolutions || {},
      approaches,
      resources,
      hints,
      curatedLists,
      companies,
      tags,
      editorial: compiledEditorial,
      order: Number(order) || 0,
      status: publishImmediate ? 'published' : status,
    };

    try {
      if (mode === 'edit' && problemId) {
        await dsaProblemRepository.update(problemId, problemData, user.uid);
      } else {
        await dsaProblemRepository.create(problemData, user.uid);
      }
      setSavedSuccess(true);
      setTimeout(() => {
        router.push('/admin/dsa');
      }, 1000);
    } catch (err: unknown) {
      console.error('Save error:', err);
      setError((err as Error)?.message || 'Failed to save problem.');
    } finally {
      setSaving(false);
    }
  };

  // Build the live preview problem object for real-time drawer view
  const previewProblem: DsaProblemListItem = useMemo(() => {
    const optimalApp =
      approaches.find((a) => a.tag === 'optimal') || approaches[0] || {
        intuition: '',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        codeSolutions: {},
      };

    return {
      id: problemId || 'preview-problem-id',
      title: title || 'Untitled Problem',
      slug: slug || 'preview-slug',
      description,
      difficulty,
      category,
      link,
      videoSolution,
      tags,
      companies,
      editorial: '',
      hints,
      approach: optimalApp.intuition || '',
      timeComplexity: optimalApp.timeComplexity || 'O(N)',
      spaceComplexity: optimalApp.spaceComplexity || 'O(1)',
      codeSolutions: optimalApp.codeSolutions || {},
      approaches,
      resources,
      curatedLists,
      order: Number(order) || 0,
      status,
    };
  }, [
    problemId,
    title,
    slug,
    description,
    difficulty,
    category,
    link,
    videoSolution,
    tags,
    companies,
    hints,
    approaches,
    resources,
    curatedLists,
    order,
    status,
  ]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-mono text-[var(--text-subtle)]">Loading problem data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Navigation & Cockpit Bar */}
      <div className="sticky top-0 z-30 -mx-4 -mt-6 sm:-mx-8 sm:-mt-8 px-4 sm:px-8 py-4 bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border-soft)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dsa"
            className="p-2 rounded-sm text-[var(--text-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            title="Back to DSA Problems"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {mode === 'create' ? 'Create DSA Problem & Editorial Studio' : 'Edit DSA Problem'}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)]">
                Studio
              </span>
            </div>
            <p className="text-xs text-[var(--text-subtle)] hidden sm:block">
              Multi-approach algorithms, interleaved explanations, live student drawer preview, and attached guides.
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle: Edit | Split | Student Preview */}
          <div className="flex items-center p-0.5 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs font-mono">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
              }`}
              title="Form only"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Studio</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[var(--bg-surface)] text-[var(--accent-dark)] font-bold shadow-xs'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
              }`}
              title="Side-by-side Editor & Live Student Drawer"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs'
                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
              }`}
              title="Full student experience preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Student View</span>
            </button>
          </div>

          {/* Editorial Starter Templates Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-subtle)]" />
            </button>
            <div className="absolute right-0 mt-1 w-56 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-soft)] rounded-sm shadow-xl hidden group-hover:block z-50 text-xs">
              <p className="px-2 py-1 text-[10px] font-mono uppercase text-[var(--text-subtle)] font-bold">
                1-Click Solution Starters
              </p>
              <button
                onClick={() => handleApplyTemplate('hash-map')}
                className="w-full text-left px-2.5 py-1.5 rounded-xs hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
              >
                Hash Map Pattern (Two Sum)
              </button>
              <button
                onClick={() => handleApplyTemplate('two-pointers')}
                className="w-full text-left px-2.5 py-1.5 rounded-xs hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium"
              >
                Two Pointers (Palindrome)
              </button>
            </div>
          </div>

          {/* Status selector */}
          <button
            onClick={() => setStatus((s) => (s === 'published' ? 'draft' : 'published'))}
            className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-sm border transition-colors cursor-pointer ${
              status === 'published'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30'
            }`}
          >
            {status}
          </button>

          {/* Save Button */}
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-3.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>DSA problem published successfully! Redirecting...</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div
        className={`grid gap-6 items-start ${
          viewMode === 'split'
            ? 'grid-cols-1 xl:grid-cols-12'
            : viewMode === 'preview'
            ? 'grid-cols-1'
            : 'grid-cols-1'
        }`}
      >
        {/* LEFT / MAIN: Studio Editor Form (Hidden in preview mode) */}
        {viewMode !== 'preview' && (
          <div
            className={`space-y-6 ${
              viewMode === 'split' ? 'xl:col-span-6 2xl:col-span-7' : 'w-full'
            }`}
          >
            {/* Section 1: Problem Overview */}
            <div className="p-5 sm:p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[var(--accent-dark)]" />
                  1. Problem Overview &amp; Statement
                </h2>
                <span className="text-[10px] font-mono text-[var(--text-subtle)]">Required</span>
              </div>

              {/* Title & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Problem Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Two Sum, 3Sum, Valid Anagram, Course Schedule..."
                    className="w-full px-3.5 py-2 text-sm rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden font-sans"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-subtle)] shrink-0">/dsa/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManual(true);
                    }}
                    placeholder="problem-slug-identifier"
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pattern Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Algorithmic Pattern Category
                  </label>
                  <Select
                    value={category}
                    onValueChange={(val) => setCategory(val as DsaCategory)}
                  >
                    <SelectTrigger className="h-9 text-xs font-mono">
                      <SelectValue placeholder="Select Pattern Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dsaTopicsMeta.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => setDifficulty(diff.value)}
                        className={`py-2 px-1 text-xs font-mono font-bold rounded-sm border transition-all cursor-pointer ${
                          difficulty === diff.value
                            ? diff.color + ' ' + diff.border + ' shadow-xs'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)] border-[var(--border-soft)] hover:text-[var(--text-secondary)]'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Problem Statement (Markdown Editor with Write / Preview Tabs) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Problem Statement (Markdown, Examples, Constraints)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDescTab('write')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors ${
                        descTab === 'write'
                          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] font-bold'
                          : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab('preview')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors ${
                        descTab === 'preview'
                          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] font-bold'
                          : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {descTab === 'write' ? (
                  <div>
                    {/* Quick format scaffold bar */}
                    <div className="flex items-center gap-1.5 mb-1.5 overflow-x-auto text-[11px] font-mono text-[var(--text-subtle)]">
                      <button
                        type="button"
                        onClick={() =>
                          setDescription(
                            (d) =>
                              d +
                              '\n\n### Example 1:\n```text\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```'
                          )
                        }
                        className="px-2 py-1 rounded-xs bg-[var(--bg-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-soft)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        + Example Block
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDescription(
                            (d) =>
                              d +
                              '\n\n### Constraints:\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`'
                          )
                        }
                        className="px-2 py-1 rounded-xs bg-[var(--bg-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-soft)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        + Constraints
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the problem, input format, output format, examples, and constraints using Markdown..."
                      className="w-full p-3 text-xs sm:text-sm font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] min-h-[140px] text-xs sm:text-sm">
                    {description ? (
                      <MarkdownRenderer content={description} />
                    ) : (
                      <p className="text-xs text-[var(--text-subtle)] italic">
                        No problem statement entered yet.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Practice & Media Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-[var(--accent-primary)]" />
                    <ExternalLink className="w-3 h-3 text-[var(--accent-dark)]" />
                    LeetCode Practice Link
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                    <Video className="w-3 h-3 text-rose-500" />
                    Video Walkthrough URL
                  </label>
                  <input
                    type="url"
                    value={videoSolution}
                    onChange={(e) => setVideoSolution(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Dynamic Multi-Approach Solutions & Editorial Articles */}
            <div className="p-5 sm:p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <Sparkles className="w-4 h-4 text-[var(--accent-dark)]" />
                    2. Dynamic Solution Approaches ({approaches.length})
                  </h2>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                    Add multiple strategies (e.g. Brute Force vs Optimal) with text before code, code solutions, and text after code.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddApproach}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Approach</span>
                </button>
              </div>

              {/* Approach Selection Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--border-soft)]">
                {approaches.map((app, idx) => (
                  <button
                    key={app.id || idx}
                    type="button"
                    onClick={() => setActiveApproachTab(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-t-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeApproachTab === idx
                        ? 'border-[var(--accent-dark)] text-[var(--accent-dark)] font-bold bg-[var(--bg-subtle)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{app.title || `Approach ${idx + 1}`}</span>
                    {app.tag === 'optimal' && (
                      <span className="px-1.5 py-0.2 text-[9px] uppercase rounded-xs bg-emerald-500/20 text-emerald-400">
                        Opt
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Approach Editor Card */}
              {approaches[activeApproachTab] && (
                <div className="p-4 sm:p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-4">
                  {/* Approach Header with Controls */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[var(--border-soft)]">
                    <div className="flex-1 min-w-[200px] flex items-center gap-2">
                      <input
                        type="text"
                        value={approaches[activeApproachTab].title}
                        onChange={(e) =>
                          handleUpdateApproach(activeApproachTab, { title: e.target.value })
                        }
                        placeholder="Approach Title (e.g. Approach 2: Optimal Hash Map)"
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                      />
                      <div className="w-32">
                        <Select
                          value={approaches[activeApproachTab].tag || 'optimal'}
                          onValueChange={(val) =>
                            handleUpdateApproach(activeApproachTab, {
                              tag: val as 'optimal' | 'alternative' | 'brute-force',
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-mono">
                            <SelectValue placeholder="Tag" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="optimal">Optimal</SelectItem>
                            <SelectItem value="alternative">Alternative</SelectItem>
                            <SelectItem value="brute-force">Brute Force</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveApproach(activeApproachTab, 'up')}
                        disabled={activeApproachTab === 0}
                        className="p-1.5 rounded-sm hover:bg-[var(--bg-surface)] text-[var(--text-subtle)] disabled:opacity-30 cursor-pointer"
                        title="Move approach up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveApproach(activeApproachTab, 'down')}
                        disabled={activeApproachTab === approaches.length - 1}
                        className="p-1.5 rounded-sm hover:bg-[var(--bg-surface)] text-[var(--text-subtle)] disabled:opacity-30 cursor-pointer"
                        title="Move approach down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveApproach(activeApproachTab)}
                        className="p-1.5 rounded-sm hover:bg-rose-500/10 text-rose-400 cursor-pointer"
                        title="Delete approach"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Part A: Intuition & Strategy (Text BEFORE Code) */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Intuition &amp; Logic (Text Before Code)
                    </label>
                    <textarea
                      rows={3}
                      value={approaches[activeApproachTab].intuition}
                      onChange={(e) =>
                        handleUpdateApproach(activeApproachTab, { intuition: e.target.value })
                      }
                      placeholder="Explain the mental model, algorithm pattern, and key invariant before writing code..."
                      className="w-full p-3 text-xs font-mono rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  {/* Part B: Complexity Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[var(--text-subtle)] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[var(--accent-primary)]" />
                        <Clock className="w-3 h-3 text-[var(--accent-dark)]" />
                        Time Complexity
                      </label>
                      <input
                        type="text"
                        value={approaches[activeApproachTab].timeComplexity}
                        onChange={(e) =>
                          handleUpdateApproach(activeApproachTab, {
                            timeComplexity: e.target.value,
                          })
                        }
                        placeholder="e.g. O(N), O(N log N)"
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[var(--text-subtle)] mb-1 flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-[var(--accent-primary)]" />
                        <HardDrive className="w-3 h-3 text-[var(--accent-dark)]" />
                        Space Complexity
                      </label>
                      <input
                        type="text"
                        value={approaches[activeApproachTab].spaceComplexity}
                        onChange={(e) =>
                          handleUpdateApproach(activeApproachTab, {
                            spaceComplexity: e.target.value,
                          })
                        }
                        placeholder="e.g. O(1), O(N)"
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Part C: Multi-Language Code Implementations */}
                  <div>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <label className="text-xs font-mono font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                        Code Solutions ({approaches[activeApproachTab].title})
                      </label>

                      {/* Language Selector Tabs */}
                      <div className="flex items-center gap-1">
                        {(['python', 'javascript', 'cpp', 'java'] as LangTab[]).map((lang) => {
                          const currentLang =
                            approachLangTabs[approaches[activeApproachTab].id] || 'python';
                          const isLangActive = currentLang === lang;
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() =>
                                setApproachLangTabs((prev) => ({
                                  ...prev,
                                  [approaches[activeApproachTab].id]: lang,
                                }))
                              }
                              className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                                isLangActive
                                  ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] font-bold'
                                  : 'text-[var(--text-subtle)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {LANG_CONFIG[lang].label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Code Textarea with boilerplate inserter */}
                    {(() => {
                      const currentLang =
                        approachLangTabs[approaches[activeApproachTab].id] || 'python';
                      const codeVal =
                        approaches[activeApproachTab].codeSolutions?.[currentLang] || '';
                      return (
                        <div className="relative rounded-sm border border-[#272724] bg-[#151515] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#1f1f1d] border-b border-[#272724] text-[10px] font-mono text-zinc-400">
                            <span>{LANG_CONFIG[currentLang].label} Implementation</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  !codeVal.trim() ||
                                  confirm('Insert standard boilerplate into this approach?')
                                ) {
                                  handleApproachCodeChange(
                                    activeApproachTab,
                                    currentLang,
                                    LANG_CONFIG[currentLang].defaultTemplate
                                  );
                                }
                              }}
                              className="text-zinc-400 hover:text-[#C7FF3D] transition-colors cursor-pointer"
                            >
                              Insert Boilerplate
                            </button>
                          </div>
                          <textarea
                            rows={8}
                            value={codeVal}
                            onChange={(e) =>
                              handleApproachCodeChange(
                                activeApproachTab,
                                currentLang,
                                e.target.value
                              )
                            }
                            placeholder={LANG_CONFIG[currentLang].placeholder}
                            className="w-full p-3.5 font-mono text-xs text-zinc-200 bg-transparent focus:outline-hidden leading-relaxed"
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Part D: Step-by-Step Tracing & Edge Cases (Text AFTER Code) */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <BookOpen className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                      Step-by-Step Walkthrough &amp; Edge Cases (Text After Code)
                    </label>
                    <textarea
                      rows={3}
                      value={approaches[activeApproachTab].explanationAfterCode || ''}
                      onChange={(e) =>
                        handleUpdateApproach(activeApproachTab, {
                          explanationAfterCode: e.target.value,
                        })
                      }
                      placeholder="Explain the dry-run steps, edge cases (empty array, negatives), and interview gotchas..."
                      className="w-full p-3 text-xs font-mono rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)] focus:border-[var(--accent-dark)] focus:outline-hidden leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Attached Learning Resources & Guides */}
            <div className="p-5 sm:p-6 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
                    <Compass className="w-4 h-4 text-[var(--accent-dark)]" />
                    3. Attached Study Resources &amp; Guides ({resources.length})
                  </h2>
                  <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                    No need to navigate away to the Resources tab. Attach articles, visualizers, and cheat sheets directly to this problem.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddResource}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-[var(--bg-subtle)] hover:bg-[var(--bg-base)] border border-[var(--border-soft)] text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Resource</span>
                </button>
              </div>

              {resources.length === 0 ? (
                <p className="text-xs text-[var(--text-subtle)] italic py-2">
                  No resources attached yet. Click &quot;Attach Resource&quot; to link visualizers, deep-dive articles, or video walkthroughs.
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((res, i) => (
                    <div
                      key={res.id || i}
                      className="p-3.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex-1 min-w-[180px] flex items-center gap-2">
                          <div className="w-32">
                            <Select
                              value={res.type}
                              onValueChange={(val) =>
                                handleUpdateResource(i, {
                                  type: val as DsaResource['type'],
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs font-mono">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="video">Video Guide</SelectItem>
                                <SelectItem value="visualization">Visualizer</SelectItem>
                                <SelectItem value="cheatsheet">Cheatsheet</SelectItem>
                                <SelectItem value="doc">Doc Link</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <input
                            type="text"
                            value={res.title}
                            onChange={(e) => handleUpdateResource(i, { title: e.target.value })}
                            placeholder="Resource Title (e.g. Visualizing Hash Table Collisions)"
                            className="w-full px-3 py-1 text-xs font-semibold rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveResource(i)}
                          className="p-1 rounded-sm text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Remove resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="url"
                          value={res.url}
                          onChange={(e) => handleUpdateResource(i, { url: e.target.value })}
                          placeholder="URL (https://...)"
                          className="px-3 py-1 text-xs font-mono rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          value={res.description || ''}
                          onChange={(e) =>
                            handleUpdateResource(i, { description: e.target.value })
                          }
                          placeholder="Key takeaway note (optional)"
                          className="px-3 py-1 text-xs rounded-sm bg-[var(--bg-surface)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Progressive Hints & Target Companies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Progressive Hints */}
              <div className="p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-3">
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Progressive Hints ({hints.length})
                </h2>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newHint.trim()) {
                          setHints([...hints, newHint.trim()]);
                          setNewHint('');
                        }
                      }
                    }}
                    placeholder="Type hint and press Enter..."
                    className="w-full px-3 py-1.5 text-xs rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newHint.trim()) {
                        setHints([...hints, newHint.trim()]);
                        setNewHint('');
                      }
                    }}
                    className="px-2.5 py-1.5 text-xs font-mono font-bold rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {hints.map((hint, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-2 p-2 rounded-xs bg-[var(--bg-subtle)] text-xs"
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="font-mono text-[10px] text-[var(--text-subtle)] mt-0.5">
                          #{i + 1}
                        </span>
                        <p className="text-[var(--text-secondary)]">{hint}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHints(hints.filter((_, idx) => idx !== i))}
                        className="text-rose-400 hover:opacity-75 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Companies */}
              <div className="p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] space-y-3">
                <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <Building2 className="w-3.5 h-3.5 text-[var(--accent-dark)]" />
                  Target Companies
                </h2>

                <div className="flex flex-wrap gap-1">
                  {COMMON_COMPANIES.map((comp) => {
                    const isSelected = companies.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() =>
                          setCompanies((prev) =>
                            isSelected ? prev.filter((c) => c !== comp) : [...prev, comp]
                          )
                        }
                        className={`px-2 py-0.5 text-[11px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)] font-bold'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)] border-[var(--border-soft)] hover:text-[var(--text-secondary)]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {comp}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    placeholder="Other company name..."
                    className="w-full px-3 py-1 text-xs rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (companyInput.trim() && !companies.includes(companyInput.trim())) {
                        setCompanies([...companies, companyInput.trim()]);
                        setCompanyInput('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-mono font-bold rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] hover:text-[var(--text-primary)]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Curated Collections & Order */}
            <div className="p-5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                  Curated Problem Collections
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {CURATED_LISTS_OPTIONS.map((list) => {
                    const checked = curatedLists.includes(list.id);
                    return (
                      <label
                        key={list.id}
                        className="flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setCuratedLists((prev) =>
                              checked ? prev.filter((x) => x !== list.id) : [...prev, list.id]
                            )
                          }
                          className="accent-[var(--accent-dark)]"
                        />
                        <span className={checked ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}>
                          {list.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-[var(--text-secondary)]">Display Order:</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 text-xs font-mono rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* RIGHT / PREVIEW: Live Student Drawer Preview (In Split View or Preview View) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className={`rounded-sm border border-[var(--border-soft)] shadow-2xl overflow-hidden bg-[var(--bg-surface)] ${
              viewMode === 'split'
                ? 'xl:col-span-6 2xl:col-span-5 sticky top-20 max-h-[calc(100vh-100px)]'
                : 'max-w-4xl mx-auto w-full min-h-[700px]'
            }`}
          >
            {/* Live Student Preview Container */}
            <div className="h-full flex flex-col">
              <DsaSolutionView problem={previewProblem} isInlinePreview={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

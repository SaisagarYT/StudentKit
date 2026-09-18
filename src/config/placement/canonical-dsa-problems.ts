import type { DsaProblemListItem } from '@/lib/cms/types';

export const CANONICAL_DSA_PROBLEMS: DsaProblemListItem[] = [
  // --- Arrays & Hashing ---
  {
    id: 'canon-two-sum',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'arrays-hashing',
    link: 'https://leetcode.com/problems/two-sum/',
    videoSolution: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
    tags: ['array', 'hash-table'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    editorial: 'two-sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.',
    approach: 'Use a hash map to record each number and its index as we iterate. For each element `num`, check if `target - num` already exists in the map in O(1) time.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: [
      'Can you trade space for time by caching numbers you have already visited?',
      'If you store `num -> index` in a hash map, looking up `target - current_num` takes O(1) average time.'
    ],
    codeSolutions: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    prevMap = {}  # val -> index
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
    return []`,
      javascript: `function twoSum(nums, target) {
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
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> prevMap;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (prevMap.find(diff) != prevMap.end()) {
                return {prevMap[diff], i};
            }
            prevMap[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
    },
    order: 1,
    status: 'published',
  },
  {
    id: 'canon-valid-anagram',
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    category: 'arrays-hashing',
    link: 'https://leetcode.com/problems/valid-anagram/',
    videoSolution: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
    tags: ['hash-table', 'string', 'sorting'],
    companies: ['Uber', 'Amazon', 'Google', 'Bloomberg'],
    editorial: 'valid-anagram',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is formed by rearranging characters.',
    approach: 'If lengths differ, return false. Count character frequencies using an array of size 26 or a hash map. Increment for `s` and decrement for `t`, verifying all counts equal 0.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150'],
    hints: [
      'Two strings are anagrams if and only if they contain the exact same characters in equal quantities.',
      'A fixed array of size 26 is enough since lowercase English letters are used.'
    ],
    codeSolutions: {
      python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c1, c2 in zip(s, t):
        count[ord(c1) - ord('a')] += 1
        count[ord(c2) - ord('a')] -= 1
    return all(x == 0 for x in count)`,
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(x => x === 0);
}`,
      cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        vector<int> count(26, 0);
        for (int i = 0; i < s.length(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        for (int x : count) if (x != 0) return false;
        return true;
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
}`
    },
    order: 2,
    status: 'published',
  },
  {
    id: 'canon-group-anagrams',
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'arrays-hashing',
    link: 'https://leetcode.com/problems/group-anagrams/',
    videoSolution: 'https://www.youtube.com/watch?v=vzdNOK2oQ2E',
    tags: ['array', 'hash-table', 'string'],
    companies: ['Amazon', 'Microsoft', 'Apple', 'Meta'],
    editorial: 'group-anagrams',
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    approach: 'Map a canonical representation of each string to a list of original words. We can use a 26-character frequency tuple or sorted string as the hash key.',
    timeComplexity: 'O(N * K)',
    spaceComplexity: 'O(N * K)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: [
      'Two words are anagrams if sorting their letters yields the same string, or if their character frequency counts match.'
    ],
    codeSolutions: {
      python: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    res = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        res[tuple(count)].append(s)
    return list(res.values())`,
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> res;
        for (const string& s : strs) {
            string sortedKey = s;
            sort(sortedKey.begin(), sortedKey.end());
            res[sortedKey].push_back(s);
        }
        vector<vector<string>> ans;
        for (auto& pair : res) ans.push_back(pair.second);
        return ans;
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
    },
    order: 3,
    status: 'published',
  },

  // --- Two Pointers ---
  {
    id: 'canon-valid-palindrome',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    category: 'two-pointers',
    link: 'https://leetcode.com/problems/valid-palindrome/',
    videoSolution: 'https://www.youtube.com/watch?v=0k_eXX4Om5U',
    tags: ['two-pointers', 'string'],
    companies: ['Meta', 'Microsoft', 'Amazon'],
    editorial: 'valid-palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    approach: 'Use two pointers from left and right inward. Skip non-alphanumeric characters. Compare lowercased characters until pointers cross.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150'],
    hints: ['Move left pointer rightward and right pointer leftward, skipping characters that are not letters or digits.'],
    codeSolutions: {
      python: `def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True`,
      javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  const isAlnum = c => /[a-zA-Z0-9]/.test(c);
  while (l < r) {
    while (l < r && !isAlnum(s[l])) l++;
    while (l < r && !isAlnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }
            l++; r--;
        }
        return true;
    }
}`
    },
    order: 4,
    status: 'published',
  },
  {
    id: 'canon-three-sum',
    slug: '3sum',
    title: '3Sum',
    difficulty: 'medium',
    category: 'two-pointers',
    link: 'https://leetcode.com/problems/3sum/',
    videoSolution: 'https://www.youtube.com/watch?v=jzZsG8n2R9A',
    tags: ['array', 'two-pointers', 'sorting'],
    companies: ['Meta', 'Amazon', 'Google', 'Microsoft'],
    editorial: '3sum',
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. No duplicate triplets.',
    approach: 'Sort the array. Iterate through each element as the anchor. If `nums[i] > 0`, break early. Use two pointers on the remaining array (`l = i + 1`, `r = len - 1`). Skip duplicate values on both pointers.',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1) (excluding output)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: [
      'Sorting allows you to use the two-pointer technique to find pairs in O(N).',
      'Remember to advance pointers past identical values to avoid returning duplicate triplets.'
    ],
    codeSolutions: {
      python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i, a in enumerate(nums):
        if a > 0:
            break
        if i > 0 and a == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            threeSumVal = a + nums[l] + nums[r]
            if threeSumVal > 0:
                r -= 1
            elif threeSumVal < 0:
                l += 1
            else:
                res.append([a, nums[l], nums[r]])
                l += 1
                r -= 1
                while nums[l] == nums[l - 1] and l < r:
                    l += 1
    return res`,
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum > 0) r--;
      else if (sum < 0) l++;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        l++; r--;
        while (nums[l] === nums[l - 1] && l < r) l++;
      }
    }
  }
  return res;
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum > 0) r--;
                else if (sum < 0) l++;
                else {
                    res.push_back({nums[i], nums[l], nums[r]});
                    l++; r--;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                }
            }
        }
        return res;
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum > 0) r--;
                else if (sum < 0) l++;
                else {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    l++; r--;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                }
            }
        }
        return res;
    }
}`
    },
    order: 5,
    status: 'published',
  },

  // --- Sliding Window ---
  {
    id: 'canon-best-time-stock',
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'sliding-window',
    link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    videoSolution: 'https://www.youtube.com/watch?v=1pkOGYD3rKc',
    tags: ['array', 'dynamic-programming'],
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
    editorial: 'best-time-to-buy-and-sell-stock',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell.',
    approach: 'Track the minimum price seen so far (`minPrice`). For each day, calculate `price - minPrice` and update `maxProfit`. Update `minPrice` whenever a cheaper purchase day is discovered.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['You can only sell after you buy. Maintain the lowest buying price encountered as you iterate forward.'],
    codeSolutions: {
      python: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
    return max_profit`,
      javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
  }
  return maxProfit;
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = 1e9, maxProfit = 0;
        for (int p : prices) {
            minPrice = min(minPrice, p);
            maxProfit = max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        return maxProfit;
    }
}`
    },
    order: 6,
    status: 'published',
  },
  {
    id: 'canon-longest-substring-without-repeat',
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'sliding-window',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    videoSolution: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
    tags: ['hash-table', 'string', 'sliding-window'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Meta'],
    editorial: 'longest-substring-without-repeating-characters',
    description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
    approach: 'Use a dynamic sliding window with a set or last-seen index map. When encountering a duplicate character, shrink the window from the left until the duplicate is evicted.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M)) where M is character set size',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['Expand the right boundary while characters are unique. Shrink the left boundary when a duplicate appears.'],
    codeSolutions: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    l = 0
    res = 0
    for r in range(len(s)):
        while s[r] in char_set:
            char_set.remove(s[l])
            l += 1
        char_set.add(s[r])
        res = max(res, r - l + 1)
    return res`,
      javascript: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let l = 0, res = 0;
  for (let r = 0; r < s.length; r++) {
    while (set.has(s[r])) {
      set.delete(s[l]);
      l++;
    }
    set.add(s[r]);
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
      cpp: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> set;
        int l = 0, res = 0;
        for (int r = 0; r < s.length(); r++) {
            while (set.count(s[r])) {
                set.erase(s[l]);
                l++;
            }
            set.insert(s[r]);
            res = max(res, r - l + 1);
        }
        return res;
    }
};`,
      java: `import java.util.HashSet;
import java.util.Set;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int l = 0, res = 0;
        for (int r = 0; r < s.length(); r++) {
            while (set.contains(s.charAt(r))) {
                set.remove(s.charAt(l));
                l++;
            }
            set.add(s.charAt(r));
            res = Math.max(res, r - l + 1);
        }
        return res;
    }
}`
    },
    order: 7,
    status: 'published',
  },

  // --- Stack ---
  {
    id: 'canon-valid-parentheses',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'stack',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    videoSolution: 'https://www.youtube.com/watch?v=WTzjTskDFMg',
    tags: ['string', 'stack'],
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    editorial: 'valid-parentheses',
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of bracket in the correct order.",
    approach: 'Use a stack. When an opening bracket is seen, push it onto the stack. When a closing bracket is seen, check if the stack is non-empty and the top element matches the corresponding opening bracket.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['A closing bracket must match the most recently opened bracket. A LIFO stack is ideal.'],
    codeSolutions: {
      python: `def isValid(s: str) -> bool:
    stack = []
    close_to_open = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in close_to_open:
            if stack and stack[-1] == close_to_open[c]:
                stack.pop()
            else:
                return False
        else:
            stack.append(c)
    return len(stack) == 0`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c in map) {
      if (stack.length && stack[stack.length - 1] === map[c]) {
        stack.pop();
      } else return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> map = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (map.count(c)) {
                if (!st.empty() && st.top() == map[c]) st.pop();
                else return false;
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    order: 8,
    status: 'published',
  },

  // --- Linked List ---
  {
    id: 'canon-reverse-linked-list',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    category: 'linked-list',
    link: 'https://leetcode.com/problems/reverse-linked-list/',
    videoSolution: 'https://www.youtube.com/watch?v=G0_I-ZF0S38',
    tags: ['linked-list', 'recursion'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple'],
    editorial: 'reverse-linked-list',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    approach: 'Use three pointers: `prev` (initially null), `curr` (initially head), and `nxt`. Iterate while `curr` is not null: save `curr.next`, redirect `curr.next = prev`, advance `prev = curr` and `curr = nxt`.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['Remember to preserve the reference to the next node before overwriting the next pointer of the current node.'],
    codeSolutions: {
      python: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      javascript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
}`
    },
    order: 9,
    status: 'published',
  },
  {
    id: 'canon-merge-two-sorted-lists',
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    category: 'linked-list',
    link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    videoSolution: 'https://www.youtube.com/watch?v=XIdigk956u0',
    tags: ['linked-list', 'recursion'],
    companies: ['Amazon', 'Apple', 'Microsoft'],
    editorial: 'merge-two-sorted-lists',
    description: 'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes of the first two lists.',
    approach: 'Create a dummy head node and a current pointer. Compare the values at `list1` and `list2`, appending the smaller node and advancing its pointer. Attach any remaining nodes at the end.',
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150'],
    hints: ['A dummy head node eliminates edge cases for initializing the merged list head.'],
    codeSolutions: {
      python: `def mergeTwoLists(list1, list2):
    dummy = ListNode()
    tail = dummy
    while list1 and list2:
        if list1.val < list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 or list2
    return dummy.next`,
      javascript: `function mergeTwoLists(list1, list2) {
  const dummy = { next: null };
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (list1 && list2) {
            if (list1->val < list2->val) {
                tail->next = list1;
                list1 = list1->next;
            } else {
                tail->next = list2;
                list2 = list2->next;
            }
            tail = tail->next;
        }
        tail->next = list1 ? list1 : list2;
        return dummy.next;
    }
};`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`
    },
    order: 10,
    status: 'published',
  },

  // --- Trees ---
  {
    id: 'canon-invert-binary-tree',
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'easy',
    category: 'trees',
    link: 'https://leetcode.com/problems/invert-binary-tree/',
    videoSolution: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY',
    tags: ['tree', 'depth-first-search', 'breadth-first-search', 'binary-tree'],
    companies: ['Google', 'Amazon', 'Microsoft'],
    editorial: 'invert-binary-tree',
    description: 'Given the `root` of a binary tree, invert the tree (mirror all left and right children), and return its root.',
    approach: 'Recursively swap the left and right child pointers of each node. Base case: if root is null, return null.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) where H is tree height',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['Swap the left and right subtrees, then recursively call invert on both children.'],
    codeSolutions: {
      python: `def invertTree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    return root`,
      javascript: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`
    },
    order: 11,
    status: 'published',
  },

  // --- Graphs ---
  {
    id: 'canon-number-of-islands',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'medium',
    category: 'graphs',
    link: 'https://leetcode.com/problems/number-of-islands/',
    videoSolution: 'https://www.youtube.com/watch?v=pV2kpPD66nE',
    tags: ['array', 'depth-first-search', 'breadth-first-search', 'union-find', 'matrix'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Meta'],
    editorial: 'number-of-islands',
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    approach: 'Iterate over every cell in the matrix. When an unvisited land cell `1` is found, increment the island count and launch a DFS or BFS to sink/visit all 4-directionally connected land cells.',
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N) worst case recursion stack',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['Mutate visited land cells to "0" in-place to save extra memory for a visited set.'],
    codeSolutions: {
      python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    return islands`,
      javascript: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  let count = 0;
  const rows = grid.length, cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        dfs(r, c);
        count++;
      }
    }
  }
  return count;
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == '1') {
                    dfs(grid, r, c);
                    count++;
                }
            }
        }
        return count;
    }
};`,
      java: `class Solution {
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    dfs(grid, r, c);
                    count++;
                }
            }
        }
        return count;
    }
}`
    },
    order: 12,
    status: 'published',
  },

  // --- Dynamic Programming ---
  {
    id: 'canon-climbing-stairs',
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'dynamic-programming',
    link: 'https://leetcode.com/problems/climbing-stairs/',
    videoSolution: 'https://www.youtube.com/watch?v=Y0lT9Fck7q8',
    tags: ['math', 'dynamic-programming', 'memoization'],
    companies: ['Amazon', 'Google', 'Apple'],
    editorial: 'climbing-stairs',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    approach: 'Subproblem: `dp[i] = dp[i-1] + dp[i-2]`. This reduces to calculating the n-th Fibonacci number. Space can be optimized to O(1) by maintaining two variables for the previous two step counts.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    curatedLists: ['blind-75', 'neetcode-150'],
    hints: ['To reach step n, you could have come from step n-1 (taking 1 step) or step n-2 (taking 2 steps).'],
    codeSolutions: {
      python: `def climbStairs(n: int) -> int:
    one, two = 1, 1
    for _ in range(n - 1):
        one, two = one + two, one
    return one`,
      javascript: `function climbStairs(n) {
  let one = 1, two = 1;
  for (let i = 0; i < n - 1; i++) {
    const temp = one;
    one = one + two;
    two = temp;
  }
  return one;
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        int one = 1, two = 1;
        for (int i = 0; i < n - 1; i++) {
            int temp = one;
            one = one + two;
            two = temp;
        }
        return one;
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        int one = 1, two = 1;
        for (int i = 0; i < n - 1; i++) {
            int temp = one;
            one = one + two;
            two = temp;
        }
        return one;
    }
}`
    },
    order: 13,
    status: 'published',
  },
  {
    id: 'canon-coin-change',
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    category: 'dynamic-programming',
    link: 'https://leetcode.com/problems/coin-change/',
    videoSolution: 'https://www.youtube.com/watch?v=H9bfqozJonY',
    tags: ['array', 'dynamic-programming', 'breadth-first-search'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Google'],
    editorial: 'coin-change',
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.',
    approach: 'Bottom-up DP: `dp[a]` stores the minimum coins needed for amount `a`. Initialize `dp` array with `amount + 1`. For each amount from 1 to `amount`, test each coin: `dp[a] = min(dp[a], 1 + dp[a - coin])`.',
    timeComplexity: 'O(amount * len(coins))',
    spaceComplexity: 'O(amount)',
    curatedLists: ['blind-75', 'neetcode-150', 'faang-50'],
    hints: ['Compute minimum coins for all smaller amounts 1..amount using previous subproblem results.'],
    codeSolutions: {
      python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return dp[amount] if dp[amount] != amount + 1 else -1`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - c]);
      }
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) {
                    dp[a] = min(dp[a], 1 + dp[a - c]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                if (a - c >= 0) {
                    dp[a] = Math.min(dp[a], 1 + dp[a - c]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    order: 14,
    status: 'published',
  },
];


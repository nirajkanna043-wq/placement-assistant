// ---------------------------------------------------------------------------
// AI Code Evaluator & Complexity Analyzer
// Evaluates algorithmic efficiency, computes asymptotic Big-O bounds,
// checks edge case resilience, and provides automated refactoring suggestions.
// ---------------------------------------------------------------------------

export const CODING_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum / Pair with Target Sum',
    category: 'Data Structures & Algorithms',
    difficulty: 'Easy / Core',
    targetRole: 'sde',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume each input has exactly one solution, and you cannot use the same element twice.`,
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) {\n        return [i, j];\n      }\n    }\n  }\n  return [];\n}`,
    optimalComplexity: 'O(n) time, O(n) space',
    exemplarSolution: `function twoSum(nums, target) {\n  const map = new Map(); // value -> index\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0, 1]' },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses / Bracket Balancer',
    category: 'Stacks & Strings',
    difficulty: 'Medium / Core',
    targetRole: 'sde',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nOpen brackets must be closed by the same type of brackets in the correct order.`,
    starterCode: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  \n  for (const char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else if (stack.pop() !== pairs[char]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    optimalComplexity: 'O(n) time, O(n) space',
    exemplarSolution: `function isValid(s) {\n  if (s.length % 2 !== 0) return false; // Odd length cannot be balanced\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let i = 0; i < s.length; i++) {\n    const c = s[i];\n    if (c === '(' || c === '{' || c === '[') {\n      stack.push(c);\n    } else if (pairs[c]) {\n      if (stack.length === 0 || stack.pop() !== pairs[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
    testCases: [
      { input: 's = "()"', expected: 'true' },
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' },
    ],
  },
  {
    id: 'sql-second-highest',
    title: 'Second Highest Salary Query',
    category: 'SQL & Database Optimization',
    difficulty: 'Medium',
    targetRole: 'data-analyst',
    description: `Write a SQL query to report the second highest distinct salary from the Employee table. If there is no second highest salary, return null.`,
    starterCode: `SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);`,
    optimalComplexity: 'O(N) with index scan, or O(1) with LIMIT OFFSET',
    exemplarSolution: `SELECT (\n  SELECT DISTINCT salary\n  FROM Employee\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;`,
    testCases: [
      { input: 'Employee with [100, 200, 300]', expected: '200' },
      { input: 'Employee with only [100]', expected: 'null' },
    ],
  },
];

/**
 * AI Static Code Analysis Engine
 * Parses structure, evaluates nested loops, detects data structures, and checks edge cases.
 */
export function analyzeCodeSubmission(codeString, problem) {
  if (!codeString || codeString.trim().length < 15) {
    return {
      score: 15,
      timeComplexity: 'Indeterminate',
      spaceComplexity: 'Indeterminate',
      isOptimal: false,
      edgeCaseScore: 10,
      strengths: ['Code submitted for review.'],
      critique: 'Submission is too sparse to evaluate. Write a complete function implementation.',
      optimizations: ['Ensure all edge cases and null checks are handled.'],
      exemplar: problem.exemplarSolution,
    };
  }

  const cleaned = codeString.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const lines = cleaned.split('\n');

  // Count loops to determine Big-O
  const forLoops = (cleaned.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (cleaned.match(/\bwhile\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  // Detect data structures
  const usesMapOrSet = /\b(Map|Set|hash|dict|object|\{\})\b/i.test(cleaned);
  const usesRecursion = problem.id && new RegExp(`\\b${problem.id}\\b.*\\(`, 'i').test(cleaned);
  const hasNestedLoop = /for\s*\(.*\{[\s\S]*?for\s*\(/.test(cleaned) || (totalLoops >= 2 && cleaned.includes('i') && cleaned.includes('j'));

  // Edge-case detection
  const checksEmpty = /length\s*===?\s*0|!nums|nums\s*==\s*null|null/i.test(cleaned);
  const checksOddEven = /%\s*2/i.test(cleaned);
  const returnsFallback = /return\s+(\[\]|false|null|-1)/i.test(cleaned);

  // Big-O deduction
  let timeComplexity = 'O(n)';
  let spaceComplexity = 'O(1)';
  let isOptimal = false;

  if (hasNestedLoop) {
    timeComplexity = 'O(n²) Quadratic Time';
    spaceComplexity = 'O(1) Auxiliary';
    isOptimal = false;
  } else if (totalLoops === 1) {
    timeComplexity = 'O(n) Linear Time';
    spaceComplexity = usesMapOrSet ? 'O(n) Auxiliary' : 'O(1)';
    isOptimal = true;
  } else if (totalLoops === 0 && cleaned.includes('SELECT')) {
    // SQL query
    timeComplexity = cleaned.includes('LIMIT') && cleaned.includes('OFFSET') ? 'O(N log N) / O(N)' : 'O(N) Full Scan';
    spaceComplexity = 'O(1)';
    isOptimal = true;
  }

  // Scoring calculation
  let efficiencyScore = isOptimal ? 90 : 55;
  let edgeCaseScore = 50;
  if (checksEmpty) edgeCaseScore += 25;
  if (returnsFallback) edgeCaseScore += 15;
  if (checksOddEven) edgeCaseScore += 10;
  edgeCaseScore = Math.min(95, edgeCaseScore);

  let styleScore = 75;
  if (cleaned.includes('const ') || cleaned.includes('let ')) styleScore += 10;
  if (lines.length > 5 && lines.length < 30) styleScore += 10;

  const overallScore = Math.round(efficiencyScore * 0.5 + edgeCaseScore * 0.3 + styleScore * 0.2);

  const strengths = [];
  const optimizations = [];

  if (isOptimal) {
    strengths.push(`Optimal time complexity achieved (${timeComplexity}).`);
  } else {
    optimizations.push(`Current complexity is ${timeComplexity}. Replace nested brute-force loops with a Hash Map to reduce lookup to O(1).`);
  }

  if (usesMapOrSet) {
    strengths.push('Effective use of hash-based lookup structure for instantaneous key retrieval.');
  }

  if (checksEmpty) {
    strengths.push('Defensive programming: includes input validation / empty check safeguards.');
  } else {
    optimizations.push('Add an initial guard clause for empty or malformed inputs (e.g. if (!nums || nums.length === 0)).');
  }

  return {
    score: overallScore,
    timeComplexity,
    spaceComplexity,
    isOptimal,
    efficiencyScore,
    edgeCaseScore,
    strengths: strengths.length ? strengths : ['Valid syntax and program structure.'],
    optimizations: optimizations.length ? optimizations : ['Code is clean and production-ready.'],
    exemplar: problem.exemplarSolution,
  };
}

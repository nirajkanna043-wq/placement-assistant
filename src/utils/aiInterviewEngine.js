// ---------------------------------------------------------------------------
// AI Mock Interview Engine & Automated Rubric Evaluator
// Simulates technical & behavioral interview rounds, evaluates candidate responses
// across Technical Depth, STAR framework structure, and generates actionable critiques.
// ---------------------------------------------------------------------------

export const INTERVIEW_QUESTIONS = {
  sde: [
    {
      id: 'sde-q1',
      type: 'Technical / Architecture',
      title: 'Scalable In-Memory Caching & Eviction',
      prompt: 'How would you design a distributed caching layer for a high-traffic e-commerce checkout service? Explain your choice of cache eviction policy and how you handle cache stampedes.',
      expectedKeywords: ['redis', 'memcached', 'lru', 'ttl', 'cache stampede', 'mutex', 'lock', 'consistency', 'eviction', 'latency'],
      idealAnswerModel: 'A robust design deploys Redis clusters with Least Recently Used (LRU) or LFU eviction policies. To prevent cache stampedes during concurrent cache misses, implement probabilistic early expiration (XFetch) or mutex locks so only one worker queries the primary DB while other requests wait or receive stale data temporarily.',
    },
    {
      id: 'sde-q2',
      type: 'Behavioral (STAR Method)',
      title: 'Resolving a Critical Production Bug',
      prompt: 'Tell me about a time when your code failed in production or caused an unexpected bug under pressure. How did you diagnose, mitigate, and prevent recurrence?',
      expectedKeywords: ['situation', 'task', 'action', 'result', 'log', 'rollback', 'postmortem', 'unit test', 'metric', 'monitoring'],
      idealAnswerModel: 'Using the STAR approach: During a campus project launch (Situation), our database connection pool exhausted due to unclosed sessions (Task). I analyzed server APM logs, deployed a quick rollback and hotfix with try-with-resources connection management (Action), restoring uptime in 12 minutes and implementing automated integration tests and connection alerts to prevent recurrence (Result).',
    },
    {
      id: 'sde-q3',
      type: 'Core Data Structures',
      title: 'Graph Traversal & Cycle Detection',
      prompt: 'How do you detect a cycle in a directed graph versus an undirected graph? Walk through the time and space complexity.',
      expectedKeywords: ['dfs', 'bfs', 'visited', 'recursion stack', 'in-degree', 'kahns algorithm', 'topological sort', 'o(v + e)'],
      idealAnswerModel: 'In directed graphs, standard visited arrays are insufficient; we must track the active recursion stack (using 3-color DFS: unvisited, visiting, visited) or use Kahn’s topological sort BFS. In undirected graphs, detecting any visited neighbor that is not the direct parent indicates a cycle. Both run in O(V + E) time and O(V) space.',
    },
  ],

  'data-analyst': [
    {
      id: 'da-q1',
      type: 'Technical / SQL & Modeling',
      title: 'Cohort Retention & Window Analysis',
      prompt: 'How would you write a query or use pandas to calculate Month-over-Month (MoM) customer retention rate across different user acquisition cohorts?',
      expectedKeywords: ['window function', 'cohort', 'date_trunc', 'lag', 'group by', 'retention', 'active users', 'churn'],
      idealAnswerModel: 'First, assign each user a cohort month using MIN(signup_date). Then, join user monthly transaction activity, group by cohort_month and activity_month, and calculate percentage of active users relative to cohort initial size using LAG() or cross-tabulation in Pandas.',
    },
    {
      id: 'da-q2',
      type: 'Business Case & Analytics',
      title: 'Diagnosing Metric Drop',
      prompt: 'Suppose daily active users (DAU) on our platform dropped by 18% over the weekend. Walk me through your step-by-step diagnostic workflow.',
      expectedKeywords: ['segmentation', 'funnel', 'device', 'geography', 'release', 'tracking bug', 'external factor', 'root cause'],
      idealAnswerModel: 'First, verify data pipeline integrity to eliminate analytics telemetry errors. Next, slice the 18% drop by dimensions: platform (iOS/Android/Web), geographical region, new vs. returning users, and feature funnels. Check if any product releases, server downtimes, or external holidays coincide to isolate root cause.',
    },
  ],

  frontend: [
    {
      id: 'fe-q1',
      type: 'Technical / Core JavaScript',
      title: 'Event Loop & Asynchronous Execution',
      prompt: 'Explain the difference between the JavaScript Macro-task queue and Micro-task queue. How do Promises, setTimeout, and requestAnimationFrame get scheduled?',
      expectedKeywords: ['event loop', 'call stack', 'microtask', 'macrotask', 'promise', 'settimeout', 'callback', 'priority'],
      idealAnswerModel: 'The JS Call Stack executes synchronous code first. Microtasks (Promise.then, queueMicrotask, MutationObserver) have higher priority and drain completely after each synchronous tick before the event loop picks one Macrotask (setTimeout, setInterval). requestAnimationFrame executes just prior to browser repainting.',
    },
    {
      id: 'fe-q2',
      type: 'Architecture / React Performance',
      title: 'Optimizing Re-renders in Large React Applications',
      prompt: 'A dashboard rendering 2,000 data rows is lagging when users type in a search input. How would you diagnose and eliminate unnecessary re-renders?',
      expectedKeywords: ['profiler', 'usememo', 'usecallback', 'virtualization', 'react.memo', 'debouncing', 'state colocation'],
      idealAnswerModel: 'First, profile components with React DevTools Profiler to identify render bottlenecks. Colocate input state or debounce search terms. For 2,000 items, implement DOM virtualization (e.g., react-window) so only visible rows render. Wrap row items in React.memo with stable callbacks via useCallback.',
    },
  ],
};

/**
 * Evaluates candidate interview response using NLP rubric criteria
 *
 * @param {string} responseText
 * @param {Object} question
 * @returns {Object} Scores, feedback, STAR checklist, and exemplar
 */
export function evaluateInterviewResponse(responseText, question) {
  if (!responseText || responseText.trim().length < 20) {
    return {
      overallScore: 20,
      technicalDepthScore: 15,
      structureScore: 20,
      communicationScore: 30,
      feedback: 'Response is too brief. In a real interview, aim to provide detailed reasoning, specific examples, and trade-offs.',
      matchedKeywords: [],
      missingKeywords: question.expectedKeywords || [],
      strengths: ['Prompt submitted'],
      improvements: ['Elaborate with concrete architectural decisions, metrics, and outcomes.'],
      idealAnswer: question.idealAnswerModel,
    };
  }

  const lower = responseText.toLowerCase();
  const words = responseText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Keyword & Technical Concept Match
  const expected = question.expectedKeywords || [];
  const matched = expected.filter((kw) => lower.includes(kw.toLowerCase()));
  const missing = expected.filter((kw) => !lower.includes(kw.toLowerCase()));
  const keywordMatchRatio = expected.length > 0 ? matched.length / expected.length : 0.5;

  let technicalDepthScore = Math.min(95, Math.round(keywordMatchRatio * 75 + Math.min(25, wordCount / 4)));

  // 2. Structural & STAR Framework Assessment
  let structureScore = 50;
  const isBehavioral = question.type.includes('STAR') || question.type.includes('Behavioral');
  const starIndicators = {
    situation: ['situation', 'context', 'when i was', 'during my', 'project', 'company'],
    task: ['task', 'goal', 'responsibility', 'needed to', 'problem', 'challenge'],
    action: ['i implemented', 'i designed', 'action', 'solved', 'investigated', 'built', 'analyzed'],
    result: ['result', 'outcome', 'metrics', 'improved', 'reduced', 'percent', '%', 'latency', 'achieved'],
  };

  let starHits = 0;
  Object.values(starIndicators).forEach((patterns) => {
    if (patterns.some((p) => lower.includes(p))) starHits += 1;
  });

  if (isBehavioral) {
    structureScore = Math.min(95, Math.round(30 + starHits * 16));
  } else {
    // Technical questions look for trade-offs & justification
    const hasTradeoffs = ['because', 'however', 'trade-off', 'tradeoff', 'advantage', 'complexity', 'versus', 'instead'].some((w) => lower.includes(w));
    structureScore = Math.min(95, Math.round(45 + (hasTradeoffs ? 30 : 10) + Math.min(20, wordCount / 5)));
  }

  // 3. Communication Clarity
  let communicationScore = 60;
  if (wordCount >= 60 && wordCount <= 250) communicationScore += 25; // ideal concise length
  else if (wordCount > 250) communicationScore += 15;
  else communicationScore += Math.round(wordCount * 0.3);

  const overallScore = Math.round(technicalDepthScore * 0.45 + structureScore * 0.35 + communicationScore * 0.20);

  // Constructive feedback generation
  const strengths = [];
  const improvements = [];

  if (matched.length >= 3) {
    strengths.push(`Strong vocabulary: demonstrated command of core concepts (${matched.slice(0, 3).join(', ')}).`);
  }
  if (wordCount >= 80) {
    strengths.push('Thorough answer length with solid conceptual explanation.');
  }
  if (isBehavioral && starHits >= 3) {
    strengths.push('Effective STAR storytelling structure connecting actions to outcomes.');
  }

  if (missing.length > 0) {
    improvements.push(`Consider mentioning key concepts like: ${missing.slice(0, 3).join(', ')}.`);
  }
  if (wordCount < 60) {
    improvements.push('Expand your explanation with real-world examples, failure modes, or time/space trade-offs.');
  }
  if (!lower.includes('result') && !lower.includes('metric') && !lower.includes('%')) {
    improvements.push('Quantify the business or performance impact (e.g. "% reduction in latency" or "improved query time").');
  }

  return {
    overallScore,
    technicalDepthScore,
    structureScore,
    communicationScore,
    matchedKeywords: matched,
    missingKeywords: missing,
    strengths: strengths.length ? strengths : ['Good initial answer attempt.'],
    improvements: improvements.length ? improvements : ['Polished response! Practice speaking this aloud within 2 minutes.'],
    idealAnswer: question.idealAnswerModel,
  };
}

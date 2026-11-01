// ---------------------------------------------------------------------------
// AI NLP Engine: Resume & Profile Information Extraction (Course Project IP)
// Implements tokenization, n-gram matching, semantic ontology mapping,
// keyword density scoring, and ATS compatibility evaluation.
// ---------------------------------------------------------------------------

export const SKILL_ONTOLOGY = {
  'Data Structures & Algorithms': {
    aliases: ['dsa', 'data structures', 'algorithms', 'trees', 'graphs', 'dynamic programming', 'recursion', 'binary search', 'sorting', 'leetcode', 'hackerrank', 'codeforces', 'time complexity', 'space complexity'],
    weight: 1.2,
    category: 'Core Computer Science',
  },
  'Object-Oriented Programming': {
    aliases: ['oops', 'oop', 'object-oriented', 'polymorphism', 'inheritance', 'encapsulation', 'abstraction', 'design patterns', 'solid principles', 'classes', 'interfaces'],
    weight: 1.0,
    category: 'Core Computer Science',
  },
  'System Design Basics': {
    aliases: ['system design', 'scalability', 'load balancer', 'caching', 'redis', 'microservices', 'distributed systems', 'sharding', 'cdn', 'rate limiting', 'database indexing'],
    weight: 1.1,
    category: 'Architecture',
  },
  SQL: {
    aliases: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle', 'database queries', 'joins', 'indexing', 'normalization', 'rdbms', 'stored procedures'],
    weight: 1.1,
    category: 'Database & Storage',
  },
  'Git & Version Control': {
    aliases: ['git', 'github', 'gitlab', 'version control', 'pull request', 'merge conflict', 'branching', 'ci/cd', 'git rebase'],
    weight: 0.9,
    category: 'Tools & DevOps',
  },
  'REST API Development': {
    aliases: ['rest api', 'restful', 'endpoints', 'express', 'fastapi', 'flask', 'django', 'backend api', 'http methods', 'postman', 'swagger', 'api design'],
    weight: 1.1,
    category: 'Backend Engineering',
  },
  'Problem Solving (Aptitude)': {
    aliases: ['aptitude', 'problem solving', 'logical reasoning', 'quantitative', 'critical thinking', 'analytical', 'puzzles', 'competitive programming'],
    weight: 0.9,
    category: 'Foundational',
  },
  Excel: {
    aliases: ['excel', 'vlookup', 'xlookup', 'pivot tables', 'macros', 'spreadsheet', 'data cleaning', 'power query'],
    weight: 0.9,
    category: 'Data & Analytics',
  },
  'Python (Pandas/NumPy)': {
    aliases: ['python', 'pandas', 'numpy', 'scipy', 'dataframe', 'data manipulation', 'data wrangling', 'jupyter', 'colab'],
    weight: 1.2,
    category: 'Data & Analytics',
  },
  'Data Visualization': {
    aliases: ['data visualization', 'tableau', 'power bi', 'matplotlib', 'seaborn', 'plotly', 'dashboards', 'bi reporting', 'charts'],
    weight: 1.0,
    category: 'Data & Analytics',
  },
  Statistics: {
    aliases: ['statistics', 'probability', 'hypothesis testing', 'regression analysis', 'p-value', 'normal distribution', 'bayes', 'correlation', 'variance'],
    weight: 1.1,
    category: 'Data & Analytics',
  },
  'Business Communication': {
    aliases: ['communication', 'presentation', 'stakeholder management', 'client interaction', 'business writing', 'reporting', 'cross-functional collaboration'],
    weight: 0.8,
    category: 'Soft Skills',
  },
  'JavaScript (ES6+)': {
    aliases: ['javascript', 'js', 'es6', 'typescript', 'promises', 'async/await', 'closures', 'event loop', 'dom manipulation', 'vanilla js'],
    weight: 1.1,
    category: 'Frontend Engineering',
  },
  React: {
    aliases: ['react', 'react.js', 'reactjs', 'redux', 'react hooks', 'context api', 'jsx', 'next.js', 'virtual dom', 'tailwind css'],
    weight: 1.2,
    category: 'Frontend Engineering',
  },
  'HTML/CSS': {
    aliases: ['html', 'html5', 'css', 'css3', 'tailwind', 'bootstrap', 'responsive design', 'flexbox', 'grid', 'sass', 'semantic html'],
    weight: 0.9,
    category: 'Frontend Engineering',
  },
};

/**
 * Preprocess raw text: lowercase, sanitize punctuation, normalize whitespace
 */
export function cleanText(rawText) {
  if (!rawText) return '';
  return rawText
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract tokens and generate n-grams (unigram, bigram, trigram)
 */
export function extractNgrams(text, maxN = 3) {
  const words = text.split(' ').filter(Boolean);
  const ngrams = new Set();

  for (let n = 1; n <= maxN; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.add(words.slice(i, i + n).join(' '));
    }
  }

  return { words, ngrams };
}

/**
 * AI Resume Parser: Computes confidence scores for each skill based on
 * term occurrences, project context, and structural density.
 *
 * @param {string} resumeText
 * @param {Array<{skill: string, weight: number}>} targetRoleSkills
 * @returns {Object} Parse metrics, extracted skills, and recommendations
 */
export function parseResumeSkills(resumeText, targetRoleSkills = []) {
  const cleaned = cleanText(resumeText);
  if (!cleaned) {
    return {
      extractedSkills: {},
      detectedEntities: [],
      atsScore: 0,
      matchedRoleCount: 0,
      totalRoleCount: targetRoleSkills.length,
      missingKeywords: targetRoleSkills.map((r) => r.skill),
      highlights: [],
    };
  }

  const { words, ngrams } = extractNgrams(cleaned, 3);
  const totalTokens = words.length;

  const extractedSkills = {};
  const highlights = [];
  const detectedEntities = [];

  // Evaluate skills in the ontology
  Object.entries(SKILL_ONTOLOGY).forEach(([skillName, meta]) => {
    let hitCount = 0;
    const matchedTerms = [];

    meta.aliases.forEach((alias) => {
      if (ngrams.has(alias) || cleaned.includes(` ${alias} `) || cleaned.startsWith(`${alias} `)) {
        hitCount += 1;
        matchedTerms.push(alias);
      }
    });

    if (hitCount > 0) {
      // Confidence heuristic: base frequency + semantic weight factor
      const density = (hitCount / Math.max(1, totalTokens)) * 1000;
      let confidence = Math.min(95, Math.round(35 + hitCount * 18 + density * 4));
      
      // Bonus if matched terms include multi-word technical concepts
      const hasSpecificConcept = matchedTerms.some((t) => t.includes(' '));
      if (hasSpecificConcept) confidence = Math.min(95, confidence + 10);

      extractedSkills[skillName] = {
        level: confidence,
        hits: hitCount,
        matchedTerms: [...new Set(matchedTerms)],
        category: meta.category,
      };

      detectedEntities.push({
        skill: skillName,
        confidence,
        terms: matchedTerms,
        category: meta.category,
      });
    }
  });

  // Calculate ATS match metrics relative to target role
  let matchedWeightedSum = 0;
  let totalWeight = 0;
  const missingKeywords = [];

  targetRoleSkills.forEach(({ skill, weight }) => {
    totalWeight += weight;
    if (extractedSkills[skill]) {
      const fraction = extractedSkills[skill].level / 100;
      matchedWeightedSum += fraction * weight;
    } else {
      missingKeywords.push(skill);
    }
  });

  const atsScore = totalWeight > 0 ? Math.round((matchedWeightedSum / totalWeight) * 100) : 0;
  const matchedRoleCount = targetRoleSkills.filter((r) => extractedSkills[r.skill]).length;

  // Extract notable experience/project lines as evidence
  const lines = resumeText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 20);
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    const matches = targetRoleSkills.filter((r) => lower.includes(r.skill.toLowerCase()));
    if (matches.length > 0 && highlights.length < 4) {
      highlights.push({
        line,
        matchedSkill: matches[0].skill,
      });
    }
  });

  return {
    extractedSkills,
    detectedEntities,
    atsScore,
    matchedRoleCount,
    totalRoleCount: targetRoleSkills.length,
    missingKeywords,
    highlights,
    tokenCount: totalTokens,
  };
}

/** Pre-built benchmark resume samples for instant viva & testing */
export const SAMPLE_RESUMES = {
  sde: `Aarav Mehta
Education: B.Tech Computer Science (CGPA: 8.6/10)
Technical Skills: Data Structures & Algorithms, C++, Java, Object-Oriented Programming (OOP), SQL, MySQL, Git, GitHub, REST API development, System Design basics.
Projects:
1. Distributed Cache System: Designed an in-memory key-value caching service using Redis principles, hashing, and LRU eviction policy. Handled 10k concurrent requests.
2. E-Commerce Microservices: Built RESTful API endpoints in Java Spring Boot with MySQL relational schemas, ACID transactions, and JWT authentication.
3. LeetCode: Solved 350+ DSA problems covering Binary Search Trees, Dynamic Programming, Graphs, and Greedy Algorithms.`,

  dataAnalyst: `Diya Nair
Education: B.Tech Information Technology (CGPA: 8.4/10)
Technical Skills: SQL, PostgreSQL, Python (Pandas, NumPy), Excel (VLOOKUP, Pivot Tables), Data Visualization, Tableau, Statistics & Hypothesis Testing, Business Communication.
Projects:
1. Customer Churn Prediction & Analysis: Processed 100,000+ customer records using Pandas for data wrangling; performed statistical correlation and regression tests.
2. Executive Sales Dashboard: Built interactive Tableau dashboards and Excel pivot models to visualize quarterly revenue KPIs for stakeholder reporting.
3. Database Optimization: Authored complex SQL queries involving window functions, aggregations, and multi-table joins.`,

  frontend: `Sneha Reddy
Education: B.Tech Computer Science (CGPA: 8.8/10)
Technical Skills: JavaScript (ES6+), React.js, HTML5, CSS3, Tailwind CSS, REST API Development, Git, Version Control, Responsive Web Design, Problem Solving.
Projects:
1. Collaborative Kanban Workspace: Built responsive single-page web app in React with Hooks, Context API, drag-and-drop state management, and Tailwind CSS.
2. Weather Analytics Portal: Integrated OpenWeather REST API using async/await and fetch; visualized real-time forecasts with modern UI design patterns.
3. Version Control Workflow: Actively managed 15+ Git repositories with feature branches, PR reviews, and CI/CD pipelines.`,
};

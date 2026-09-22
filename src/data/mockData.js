// ---------------------------------------------------------------------------
// Job-role → required skills → weightage
// (Phase 3 of the execution plan: "Create or source a job-role skill
// requirement dataset... structure them into role → required skills → weightage")
// ---------------------------------------------------------------------------
export const ROLES = [
  {
    id: 'sde',
    name: 'Software Development Engineer',
    skills: [
      { skill: 'Data Structures & Algorithms', weight: 25 },
      { skill: 'Object-Oriented Programming', weight: 15 },
      { skill: 'System Design Basics', weight: 10 },
      { skill: 'SQL', weight: 15 },
      { skill: 'Git & Version Control', weight: 10 },
      { skill: 'REST API Development', weight: 15 },
      { skill: 'Problem Solving (Aptitude)', weight: 10 },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    skills: [
      { skill: 'SQL', weight: 25 },
      { skill: 'Excel', weight: 15 },
      { skill: 'Python (Pandas/NumPy)', weight: 20 },
      { skill: 'Data Visualization', weight: 15 },
      { skill: 'Statistics', weight: 15 },
      { skill: 'Business Communication', weight: 10 },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    skills: [
      { skill: 'JavaScript (ES6+)', weight: 20 },
      { skill: 'React', weight: 25 },
      { skill: 'HTML/CSS', weight: 15 },
      { skill: 'REST API Development', weight: 10 },
      { skill: 'Git & Version Control', weight: 10 },
      { skill: 'Problem Solving (Aptitude)', weight: 10 },
      { skill: 'Data Structures & Algorithms', weight: 10 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Skill → curated learning resources (2-3 per skill, per Phase 3)
// ---------------------------------------------------------------------------
export const RESOURCE_MAP = {
  'Data Structures & Algorithms': [
    { title: 'NeetCode 150', type: 'Practice Platform', url: 'https://neetcode.io/practice' },
    { title: 'Striver\u2019s A2Z DSA Sheet', type: 'Course', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' },
    { title: 'CS50: Algorithms Lecture', type: 'Video', url: 'https://cs50.harvard.edu' },
  ],
  'Object-Oriented Programming': [
    { title: 'OOP Concepts in Java/Python', type: 'Article', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' },
    { title: 'Refactoring Guru: OOP & Design Patterns', type: 'Course', url: 'https://refactoring.guru' },
  ],
  'System Design Basics': [
    { title: 'System Design Primer', type: 'Article', url: 'https://github.com/donnemartin/system-design-primer' },
    { title: 'Gaurav Sen \u2014 System Design Playlist', type: 'Video', url: 'https://www.youtube.com/@gkcs' },
  ],
  SQL: [
    { title: 'Mode SQL Tutorial', type: 'Course', url: 'https://mode.com/sql-tutorial/' },
    { title: 'LeetCode Database Problems', type: 'Practice Platform', url: 'https://leetcode.com/studyplan/top-sql-50/' },
  ],
  'Git & Version Control': [
    { title: 'Git & GitHub Crash Course', type: 'Video', url: 'https://www.youtube.com/results?search_query=git+github+crash+course' },
    { title: 'Learn Git Branching (interactive)', type: 'Practice Platform', url: 'https://learngitbranching.js.org/' },
  ],
  'REST API Development': [
    { title: 'REST API Design Best Practices', type: 'Article', url: 'https://restfulapi.net/' },
    { title: 'Build a REST API with FastAPI', type: 'Course', url: 'https://fastapi.tiangolo.com/tutorial/' },
  ],
  'Problem Solving (Aptitude)': [
    { title: 'IndiaBix Aptitude Practice', type: 'Practice Platform', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
    { title: 'PrepInsta Placement Aptitude', type: 'Practice Platform', url: 'https://prepinsta.com/' },
  ],
  Excel: [
    { title: 'Excel Skills for Business (Coursera)', type: 'Course', url: 'https://www.coursera.org/specializations/excel' },
    { title: 'ExcelJet Formula Reference', type: 'Article', url: 'https://exceljet.net/' },
  ],
  'Python (Pandas/NumPy)': [
    { title: 'Kaggle: Pandas Micro-course', type: 'Course', url: 'https://www.kaggle.com/learn/pandas' },
    { title: '100 Pandas Exercises', type: 'Practice Platform', url: 'https://github.com/ajcr/100-pandas-puzzles' },
  ],
  'Data Visualization': [
    { title: 'Storytelling with Data', type: 'Article', url: 'https://www.storytellingwithdata.com/' },
    { title: 'Tableau Public Training', type: 'Course', url: 'https://public.tableau.com/en-us/s/resources' },
  ],
  Statistics: [
    { title: 'Khan Academy: Statistics & Probability', type: 'Course', url: 'https://www.khanacademy.org/math/statistics-probability' },
    { title: 'StatQuest (YouTube)', type: 'Video', url: 'https://www.youtube.com/@statquest' },
  ],
  'Business Communication': [
    { title: 'Effective Business Writing', type: 'Course', url: 'https://www.coursera.org/learn/business-writing' },
  ],
  'JavaScript (ES6+)': [
    { title: 'JavaScript.info', type: 'Article', url: 'https://javascript.info/' },
    { title: 'Namaste JavaScript', type: 'Video', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP' },
  ],
  React: [
    { title: 'Official React Docs \u2014 Learn', type: 'Article', url: 'https://react.dev/learn' },
    { title: 'React Practice Projects', type: 'Practice Platform', url: 'https://www.frontendmentor.io/' },
  ],
  'HTML/CSS': [
    { title: 'CSS Tricks: A Complete Guide', type: 'Article', url: 'https://css-tricks.com/' },
    { title: 'Frontend Mentor Challenges', type: 'Practice Platform', url: 'https://www.frontendmentor.io/' },
  ],
};

// ---------------------------------------------------------------------------
// Diagnostic quiz bank — a couple of quick self-assessment questions per
// skill (Phase 3: "Design the student intake form/quiz")
// ---------------------------------------------------------------------------
export const QUIZ_BANK = {
  'Data Structures & Algorithms': [
    { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1 },
    { q: 'Which structure uses LIFO ordering?', options: ['Queue', 'Stack', 'Heap', 'Graph'], answer: 1 },
  ],
  SQL: [
    { q: 'Which clause filters rows after grouping?', options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP'], answer: 1 },
    { q: 'Which JOIN returns unmatched rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], answer: 2 },
  ],
  React: [
    { q: 'Which hook manages local component state?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], answer: 1 },
    { q: 'What does JSX compile down to?', options: ['HTML strings', 'React.createElement calls', 'CSS', 'JSON'], answer: 1 },
  ],
  'Python (Pandas/NumPy)': [
    { q: 'Which function reads a CSV into a DataFrame?', options: ['pd.read_csv()', 'pd.open_csv()', 'pd.load()', 'pd.csv()'], answer: 0 },
  ],
};

// ---------------------------------------------------------------------------
// Seed students for the TPO/counsellor batch dashboard demo
// ---------------------------------------------------------------------------
export const SEED_BATCH = [
  { id: 's1', name: 'Aarav Mehta', roleId: 'sde', readiness: 78 },
  { id: 's2', name: 'Diya Nair', roleId: 'data-analyst', readiness: 54 },
  { id: 's3', name: 'Rohan Iyer', roleId: 'sde', readiness: 41 },
  { id: 's4', name: 'Sneha Reddy', roleId: 'frontend', readiness: 88 },
  { id: 's5', name: 'Kabir Shah', roleId: 'sde', readiness: 63 },
  { id: 's6', name: 'Ananya Rao', roleId: 'data-analyst', readiness: 35 },
];

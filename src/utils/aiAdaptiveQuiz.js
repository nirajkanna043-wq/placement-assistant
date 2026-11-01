// ---------------------------------------------------------------------------
// AI Adaptive Assessment: Bayesian Knowledge Tracing & IRT Engine
// Dynamic difficulty adjustment, Bayesian probability of mastery update,
// and in-depth AI pedagogical explanations for every answer.
// ---------------------------------------------------------------------------

export const ADAPTIVE_QUIZ_BANK = {
  'Data Structures & Algorithms': [
    {
      id: 'dsa-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      answer: 1,
      explanation: 'In a balanced BST with n nodes, each comparison eliminates half the remaining search space, resulting in logarithmic height h = O(log n).',
    },
    {
      id: 'dsa-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'Which data structure is optimal for implementing an LRU (Least Recently Used) cache with O(1) get and put operations?',
      options: ['Array + Binary Search', 'Doubly Linked List + Hash Map', 'Min-Heap + Array', 'Stack + Queue'],
      answer: 1,
      explanation: 'A Hash Map provides O(1) lookup to find node references, while a Doubly Linked List allows O(1) node removal and insertion at the head for recency tracking.',
    },
    {
      id: 'dsa-3',
      difficulty: 'Hard',
      diffVal: 3,
      q: 'In dynamic programming, what distinguishes the 0/1 Knapsack problem from the Fractional Knapsack problem?',
      options: [
        '0/1 Knapsack can be solved with a greedy strategy; Fractional requires DP.',
        '0/1 Knapsack requires whole items (cannot break items); Fractional allows dividing items.',
        'Fractional Knapsack has O(2^n) complexity; 0/1 is O(n log n).',
        'There is no theoretical difference in constraint structure.',
      ],
      answer: 1,
      explanation: 'In 0/1 Knapsack, an item must either be taken entirely or left (discrete decision), requiring dynamic programming. Fractional Knapsack exhibits greedy choice property.',
    },
  ],

  'System Design Basics': [
    {
      id: 'sys-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'What is the primary role of a Content Delivery Network (CDN) in web architecture?',
      options: [
        'Running backend database transactions',
        'Serving static assets from edge locations geographically closer to users',
        'Encrypting internal microservice communication',
        'Managing user authentication tokens',
      ],
      answer: 1,
      explanation: 'CDNs cache and distribute static media (images, CSS, JS, videos) at edge points of presence (PoPs) worldwide, slashing latency and origin server load.',
    },
    {
      id: 'sys-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'According to the CAP Theorem, which pair of guarantees can a distributed datastore provide during a network partition (P)?',
      options: ['Both Consistency and Availability (CA)', 'Either Consistency (CP) or Availability (AP)', 'Neither Consistency nor Availability', 'All three simultaneously (CAP)'],
      answer: 1,
      explanation: 'When a network partition (P) inevitably occurs between nodes, a distributed system must choose between returning consistent errors/stalls (CP) or answering with potentially stale data (AP).',
    },
    {
      id: 'sys-3',
      difficulty: 'Hard',
      diffVal: 3,
      q: 'Which caching strategy writes data directly to both the cache and the backing database synchronously before acknowledging the client?',
      options: ['Write-Around', 'Write-Back (Write-Behind)', 'Write-Through', 'Refresh-Ahead'],
      answer: 2,
      explanation: 'Write-Through writes to both cache and database concurrently. It ensures data consistency and resilience at the expense of higher write latency.',
    },
  ],

  'Object-Oriented Programming': [
    {
      id: 'oop-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'Which OOP pillar restricts direct access to internal object state and bundles data with methods operating on that data?',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Association'],
      answer: 2,
      explanation: 'Encapsulation keeps internal representation hidden (information hiding) and exposes access strictly via public methods/getters/setters.',
    },
    {
      id: 'oop-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'Under the SOLID principles, what does the Liskov Substitution Principle (LSP) dictate?',
      options: [
        'A class should have only one reason to change.',
        'Derived classes must be substitutable for their base classes without altering program correctness.',
        'High-level modules should not depend on low-level modules.',
        'Clients should not be forced to depend on interfaces they do not use.',
      ],
      answer: 1,
      explanation: 'LSP ensures any subclass can stand in for its parent type without breaking expected invariants, semantics, or client contracts.',
    },
  ],

  SQL: [
    {
      id: 'sql-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'Which clause in SQL is used to filter aggregated group records after a GROUP BY statement?',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'QUALIFY'],
      answer: 1,
      explanation: 'WHERE filters individual candidate rows before grouping occurs; HAVING filters grouped summary buckets after aggregation.',
    },
    {
      id: 'sql-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'What is the primary operational difference between RANK() and DENSE_RANK() window functions when handling ties?',
      options: [
        'RANK() leaves gaps in sequence after tied values; DENSE_RANK() produces consecutive integers without gaps.',
        'DENSE_RANK() leaves gaps; RANK() does not.',
        'RANK() only works on numerical columns; DENSE_RANK() works on text.',
        'RANK() requires an ORDER BY clause; DENSE_RANK() does not.',
      ],
      answer: 0,
      explanation: 'If two items tie at rank 1, RANK() assigns 1, 1, 3 (leaving gap 2). DENSE_RANK() assigns 1, 1, 2 without skipping numbers.',
    },
    {
      id: 'sql-3',
      difficulty: 'Hard',
      diffVal: 3,
      q: 'Why can creating an index on a table negatively affect performance?',
      options: [
        'It increases SELECT query latency on indexed columns.',
        'It incurs overhead during INSERT, UPDATE, and DELETE operations as indexes must be rebalanced.',
        'It disables foreign key integrity checks.',
        'It prevents the query optimizer from executing nested loop joins.',
      ],
      answer: 1,
      explanation: 'Every write transaction (INSERT/UPDATE/DELETE) must update the B-Tree index pages on disk, adding I/O overhead and lock contention.',
    },
  ],

  'REST API Development': [
    {
      id: 'api-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'Which HTTP method is specifically defined by REST specifications to be idempotent for replacing a complete resource?',
      options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
      answer: 1,
      explanation: 'PUT replaces the entire resource representation and is idempotent: executing it multiple identical times produces the same server state as executing once.',
    },
    {
      id: 'api-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'Which HTTP response status code should be returned when client credentials are missing or invalid?',
      options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
      answer: 1,
      explanation: '401 Unauthorized signifies that the request requires HTTP user authentication credentials that are either absent or failed verification.',
    },
  ],

  React: [
    {
      id: 'react-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'What is the purpose of the dependency array in the React useEffect hook?',
      options: [
        'Specifying global Redux actions',
        'Controlling when the effect callback re-runs based on value changes between renders',
        'Defining CSS stylesheet dependencies',
        'Allocating memory for child components',
      ],
      answer: 1,
      explanation: 'React compares each value in the dependency array via Object.is; if none have changed across renders, the effect callback execution is skipped.',
    },
    {
      id: 'react-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'How does React Virtual DOM reconciliation identify elements across renders to minimize DOM mutations?',
      options: ['By using stable "key" props to match children across render trees', 'By reading window.localStorage', 'By serializing HTML strings into XML', 'By re-mounting the root element on every state update'],
      answer: 0,
      explanation: 'Keys give elements a stable identity inside collections, allowing React diffing algorithm to perform efficient insert/move/delete operations.',
    },
  ],

  'Python (Pandas/NumPy)': [
    {
      id: 'py-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'What is vectorization in NumPy and why is it preferred over Python for-loops?',
      options: [
        'It converts arrays to strings for faster printing.',
        'It delegates array operations to pre-compiled C routines and SIMD CPU instructions without Python interpreter loop overhead.',
        'It encrypts numerical arrays for secure cloud transfer.',
        'It automatically rounds floating point numbers to integers.',
      ],
      answer: 1,
      explanation: 'NumPy vectorized operations execute compiled C loops with hardware-level memory contiguity and SIMD parallelism, running 10x-100x faster than pure Python.',
    },
    {
      id: 'py-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'In pandas, what is the key difference between df.loc[] and df.iloc[]?',
      options: [
        'df.loc uses label-based indexing; df.iloc uses zero-based integer position indexing.',
        'df.loc is for rows only; df.iloc is for columns only.',
        'df.iloc modifies original data in-place; df.loc creates a deep copy.',
        'df.loc is deprecated in pandas 2.0.',
      ],
      answer: 0,
      explanation: 'df.loc indexes via index/column labels and includes endpoint; df.iloc indexes purely by integer coordinate positions [0, len-1].',
    },
  ],

  Statistics: [
    {
      id: 'stat-1',
      difficulty: 'Easy',
      diffVal: 1,
      q: 'In statistical hypothesis testing, what does a p-value represent?',
      options: [
        'The absolute probability that the alternative hypothesis is true',
        'The probability of observing test results at least as extreme as the sample data, assuming the null hypothesis is true',
        'The margin of error in the sample mean',
        'The power of the statistical test (1 - beta)',
      ],
      answer: 1,
      explanation: 'A p-value quantifies evidence against the null hypothesis H0. A small p-value (<0.05) suggests the observed pattern is unlikely under randomness alone.',
    },
    {
      id: 'stat-2',
      difficulty: 'Medium',
      diffVal: 2,
      q: 'What does the Central Limit Theorem (CLT) state about the sampling distribution of the sample mean?',
      options: [
        'Any population will become normally distributed if sample size is large enough.',
        'For sufficiently large sample sizes (n >= 30), the sampling distribution of the mean approaches normality, regardless of the underlying population distribution.',
        'The sample variance equals the population standard deviation.',
        'Sample size must be smaller than 5% of the total population.',
      ],
      answer: 1,
      explanation: 'CLT guarantees that sums and averages of independent random variables converge to a normal Gaussian distribution even if the underlying source data is skewed.',
    },
  ],
};

/**
 * Bayesian Knowledge Tracing (BKT) Update:
 * Updates latent mastery belief P(L_t) given observation (correct vs incorrect).
 *
 * Parameters:
 * P(L_0) = prior belief of mastery
 * P(T) = probability of transition from unmastered to mastered
 * P(G) = probability of guess (0.25 for 4-choice)
 * P(S) = probability of slip (0.10, know it but made a typo)
 */
export function updateBayesianMastery(priorMastery, isCorrect) {
  const pG = 0.25; // Guess
  const pS = 0.10; // Slip
  const pT = 0.15; // Transition / learning rate

  const pL = Math.max(0.05, Math.min(0.95, priorMastery / 100));

  let posteriorMastery;
  if (isCorrect) {
    // P(L | Correct) = [P(L) * (1 - S)] / [P(L)*(1 - S) + (1 - P(L))*G]
    const num = pL * (1 - pS);
    const den = pL * (1 - pS) + (1 - pL) * pG;
    posteriorMastery = num / den;
  } else {
    // P(L | Incorrect) = [P(L) * S] / [P(L)*S + (1 - P(L))*(1 - G)]
    const num = pL * pS;
    const den = pL * pS + (1 - pL) * (1 - pG);
    posteriorMastery = num / den;
  }

  // Next belief after learning transition P(L_t+1) = posterior + (1 - posterior)*T
  const updatedMastery = posteriorMastery + (1 - posteriorMastery) * pT;
  return Math.round(updatedMastery * 100);
}

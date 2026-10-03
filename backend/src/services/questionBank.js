/**
 * SkillForge Calibrated Item Bank
 * Each item has IRT parameters:
 *   b: Difficulty parameter (-2.5 very easy to +2.5 very hard)
 *   a: Discrimination parameter (0.8 to 2.0, how sharply it distinguishes ability)
 *   bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate'
 */

export const QUESTION_BANK = [
  // ==========================================
  // DATA STRUCTURES & ALGORITHMS
  // ==========================================
  {
    id: "dsa-01",
    topic: "Data Structures & Algorithms",
    subtopic: "Array & Complexity Basics",
    difficulty: -2.0, // Very Easy
    discrimination: 1.2,
    bloomLevel: "Remember",
    question: "What is the worst-case time complexity of accessing an element in an array by its index?",
    codeSnippet: null,
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(1)",
    explanation: "Array elements reside in contiguous memory locations. Index access uses direct pointer arithmetic `base_address + index * element_size`, executing in constant O(1) time.",
    hint: "Think about how computers calculate the memory address of an element given its index."
  },
  {
    id: "dsa-02",
    topic: "Data Structures & Algorithms",
    subtopic: "Binary Search",
    difficulty: -1.0, // Easy
    discrimination: 1.4,
    bloomLevel: "Understand",
    question: "Why does Binary Search require the input collection to be sorted before execution?",
    codeSnippet: null,
    options: [
      "To allow dividing the search space in half based on comparison with the midpoint",
      "Because unsorted arrays cannot be indexed in O(1) time",
      "To prevent duplicate values from throwing an index error",
      "Because the binary search algorithm uses recursion which only works on sorted lists"
    ],
    correctAnswer: "To allow dividing the search space in half based on comparison with the midpoint",
    explanation: "Binary search compares the target with the middle element. If sorted, comparing `target > mid` guarantees the target cannot exist in the lower half, safely discarding half the search space each step.",
    hint: "What invariant allows you to discard half the elements with just one comparison?"
  },
  {
    id: "dsa-03",
    topic: "Data Structures & Algorithms",
    subtopic: "Hash Tables",
    difficulty: 0.0, // Intermediate
    discrimination: 1.5,
    bloomLevel: "Apply",
    question: "Consider a hash table of size 7 using the hash function h(k) = k mod 7 with linear probing for collision resolution. If keys [10, 17, 24] are inserted in order, which index will key 24 occupy?",
    codeSnippet: "// Keys to insert: 10, 17, 24\n// Table size: 7\n// Collision resolution: Linear Probing",
    options: ["Index 3", "Index 4", "Index 5", "Index 6"],
    correctAnswer: "Index 5",
    explanation: "10 mod 7 = 3 (index 3). 17 mod 7 = 3 (collision at 3 -> probes 4, empty -> occupies index 4). 24 mod 7 = 3 (collision at 3 -> probes 4 [occupied] -> probes 5, empty -> occupies index 5).",
    hint: "Calculate (24 mod 7), check if indices 3 and 4 are occupied by previous insertions."
  },
  {
    id: "dsa-04",
    topic: "Data Structures & Algorithms",
    subtopic: "Graph Traversal & Shortest Path",
    difficulty: 1.2, // Advanced
    discrimination: 1.7,
    bloomLevel: "Analyze",
    question: "Why does standard Dijkstra's algorithm fail to guarantee the shortest path on graphs containing negative edge weights, whereas Bellman-Ford succeeds?",
    codeSnippet: null,
    options: [
      "Dijkstra greedily marks visited nodes as final based on local optimality, which negative edges can subsequently invalidate",
      "Dijkstra's priority queue cannot store negative numbers due to binary heap constraints",
      "Dijkstra only operates on Directed Acyclic Graphs (DAGs) and rejects cycles entirely",
      "Bellman-Ford uses Depth-First Search which naturally bypasses negative weight cycles"
    ],
    correctAnswer: "Dijkstra greedily marks visited nodes as final based on local optimality, which negative edges can subsequently invalidate",
    explanation: "Dijkstra relies on the greedy invariant that once a vertex is extracted from the priority queue, its shortest distance is finalized. A negative edge encountered later could provide a shorter alternative path through an already-visited vertex, violating this invariant.",
    hint: "What assumption does Dijkstra make about already finalized vertices?"
  },
  {
    id: "dsa-05",
    topic: "Data Structures & Algorithms",
    subtopic: "Dynamic Programming",
    difficulty: 2.1, // Expert
    discrimination: 1.9,
    bloomLevel: "Evaluate",
    question: "You need to count the number of valid parenthesizations of n pairs of parentheses. Which combinatorial recurrence relation describes this problem, and what is its closed-form solution?",
    codeSnippet: null,
    options: [
      "Catalan recurrence C(n) = Σ C(i) * C(n-1-i) with C(n) = (1 / (n + 1)) * (2n choose n)",
      "Fibonacci recurrence F(n) = F(n-1) + F(n-2) with Golden Ratio closed form",
      "Bell recurrence B(n) = Σ (n-1 choose k) * B(k)",
      "Eulerian recurrence E(n, m) = (n - m) * E(n-1, m-1) + (m + 1) * E(n-1, m)"
    ],
    correctAnswer: "Catalan recurrence C(n) = Σ C(i) * C(n-1-i) with C(n) = (1 / (n + 1)) * (2n choose n)",
    explanation: "Any valid string of parentheses of length 2n can be uniquely factored as `( A ) B` where A has length 2i and B has length 2(n-1-i). This matches the Catalan recurrence C(n) = (1/(n+1))*(2n choose n).",
    hint: "Recall the sequence 1, 1, 2, 5, 14, 42, 132... named after a Belgian mathematician."
  },

  // ==========================================
  // JAVASCRIPT & WEB ARCHITECTURE
  // ==========================================
  {
    id: "web-01",
    topic: "Web Development & JavaScript",
    subtopic: "JS Types & Equality",
    difficulty: -1.8,
    discrimination: 1.1,
    bloomLevel: "Remember",
    question: "What is the difference between `==` and `===` in JavaScript?",
    codeSnippet: null,
    options: [
      "`===` compares both value and type without coercion, whereas `==` performs type coercion",
      "`==` is used for objects while `===` is used for primitive types",
      "`===` creates a deep clone before comparison while `==` compares references",
      "`==` is deprecated in modern ECMAScript standards and throws a syntax warning"
    ],
    correctAnswer: "`===` compares both value and type without coercion, whereas `==` performs type coercion",
    explanation: "Strict equality (`===`) checks both value and data type without any implicit casting. Loose equality (`==`) coerces operands to a common type before comparison.",
    hint: "One performs implicit type conversion, while the other does not."
  },
  {
    id: "web-02",
    topic: "Web Development & JavaScript",
    subtopic: "Event Loop & Asynchrony",
    difficulty: -0.2,
    discrimination: 1.5,
    bloomLevel: "Understand",
    question: "What is the logged output order of the following JavaScript snippet?",
    codeSnippet: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
    options: ["1, 4, 3, 2", "1, 2, 3, 4", "1, 4, 2, 3", "1, 3, 4, 2"],
    correctAnswer: "1, 4, 3, 2",
    explanation: "1 and 4 run synchronously on the call stack. The Promise callback enters the Microtask queue, which has priority and executes immediately after the current call stack clears (outputting 3). The `setTimeout` callback enters the Macrotask (Task) queue, running on the subsequent event loop iteration (outputting 2).",
    hint: "Recall the distinction between Microtasks (Promises) and Macrotasks (setTimeout)."
  },
  {
    id: "web-03",
    topic: "Web Development & JavaScript",
    subtopic: "React Rendering & Hooks",
    difficulty: 0.8,
    discrimination: 1.6,
    bloomLevel: "Apply",
    question: "In React, why can passing an inline object to a memoized child component cause unnecessary re-renders?",
    codeSnippet: "// Parent component\n<MemoizedChild style={{ color: 'red' }} />",
    options: [
      "A new object reference is instantiated in memory on every parent render, failing React.memo's shallow reference equality check",
      "React.memo does not support components that accept style attributes",
      "Inline objects cause a JavaScript memory leak by mutating the React virtual DOM fiber tree directly",
      "React converts inline objects into string primitives which triggers reconciliation"
    ],
    correctAnswer: "A new object reference is instantiated in memory on every parent render, failing React.memo's shallow reference equality check",
    explanation: "React.memo compares incoming props against previous props using `Object.is` (shallow equality). An inline object `{ color: 'red' }` evaluates to a brand-new object reference in heap memory on every render, making `prevProps.style !== nextProps.style`.",
    hint: "How does JavaScript compare two independently declared objects `{ a: 1 } === { a: 1 }`?"
  },
  {
    id: "web-04",
    topic: "Web Development & JavaScript",
    subtopic: "Browser Performance & Core Web Vitals",
    difficulty: 1.5,
    discrimination: 1.7,
    bloomLevel: "Analyze",
    question: "Which Core Web Vital metric replaced First Input Delay (FID) to evaluate the responsiveness of all interactions throughout the full lifespan of a page?",
    codeSnippet: null,
    options: [
      "INP (Interaction to Next Paint)",
      "LCP (Largest Contentful Paint)",
      "CLS (Cumulative Layout Shift)",
      "TTFB (Time to First Byte)"
    ],
    correctAnswer: "INP (Interaction to Next Paint)",
    explanation: "Interaction to Next Paint (INP) assesses overall responsiveness by measuring the latency of user interactions (clicks, taps, key presses) throughout the entire page lifecycle and reporting the near-worst duration, replacing FID which only measured first interaction delay.",
    hint: "Look for the metric focused on the delay before the next frame is painted after an interaction."
  },
  {
    id: "web-05",
    topic: "Web Development & JavaScript",
    subtopic: "Web Security & CORS",
    difficulty: 2.2,
    discrimination: 1.8,
    bloomLevel: "Evaluate",
    question: "When a browser initiates a cross-origin `fetch` with `Authorization: Bearer <token>` and `Content-Type: application/json`, what triggers a preflight OPTIONS request, and which response headers must the server return?",
    codeSnippet: null,
    options: [
      "Custom Authorization headers and application/json violate simple request criteria; server must return Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers",
      "All POST requests automatically require preflight regardless of headers; server only needs Access-Control-Allow-Credentials",
      "Only the Bearer token triggers preflight; server must return Access-Control-Expose-Headers: Authorization",
      "Preflight occurs because HTTPS forbids non-standard cookies; server must reply with Strict-Transport-Security"
    ],
    correctAnswer: "Custom Authorization headers and application/json violate simple request criteria; server must return Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers",
    explanation: "A CORS request is 'simple' only if it uses GET/HEAD/POST with specific standard content-types (text/plain, multipart/form-data, application/x-www-form-urlencoded) and no custom headers. `Authorization` and `application/json` require a preflight OPTIONS check where the server must explicitly approve the origin, method, and requested headers via CORS response headers.",
    hint: "What defines a 'Simple Request' under the W3C CORS specification?"
  },

  // ==========================================
  // SYSTEM DESIGN & CLOUD ARCHITECTURE
  // ==========================================
  {
    id: "sys-01",
    topic: "System Design & Cloud",
    subtopic: "Horizontal vs Vertical Scaling",
    difficulty: -1.7,
    discrimination: 1.2,
    bloomLevel: "Remember",
    question: "What is horizontal scaling (scaling out)?",
    codeSnippet: null,
    options: [
      "Adding more compute instances/nodes to the resource pool",
      "Upgrading the CPU and RAM capacity of a single server",
      "Compressing database tables to decrease disk usage",
      "Migrating code from monolith to serverless functions"
    ],
    correctAnswer: "Adding more compute instances/nodes to the resource pool",
    explanation: "Horizontal scaling involves distributing load across multiple machines/servers, contrasting with vertical scaling (scaling up), which adds more CPU, RAM, or disk to an existing single instance.",
    hint: "Think about 'out' versus 'up'."
  },
  {
    id: "sys-02",
    topic: "System Design & Cloud",
    subtopic: "CAP Theorem",
    difficulty: -0.1,
    discrimination: 1.5,
    bloomLevel: "Understand",
    question: "According to Eric Brewer's CAP Theorem, when a network partition (P) occurs in a distributed data store, what trade-off must be made?",
    codeSnippet: null,
    options: [
      "Choose between Consistency (returning latest data or error) or Availability (every non-failing node returns a response, potentially stale)",
      "Choose between Performance or Durability",
      "Choose between Linearizability or Read Scalability",
      "Choose between Encryption at rest or Low Latency"
    ],
    correctAnswer: "Choose between Consistency (returning latest data or error) or Availability (every non-failing node returns a response, potentially stale)",
    explanation: "Since network partitions (P) are unavoidable in distributed systems, the system must either sacrifice Availability (rejecting requests to preserve strict Consistency) or sacrifice Consistency (serving potentially stale writes across partitioned nodes to preserve Availability).",
    hint: "In CAP, P is given. Which two remaining properties are in conflict?"
  },
  {
    id: "sys-03",
    topic: "System Design & Cloud",
    subtopic: "Caching Strategies",
    difficulty: 0.9,
    discrimination: 1.6,
    bloomLevel: "Apply",
    question: "Which caching pattern writes data simultaneously to both the cache and the primary datastore before acknowledging success to the client?",
    codeSnippet: null,
    options: ["Write-Through", "Write-Behind (Write-Back)", "Cache-Aside (Lazy Loading)", "Refresh-Ahead"],
    correctAnswer: "Write-Through",
    explanation: "In Write-Through caching, the application updates the cache, and the cache synchronously updates the database before returning success. This ensures consistency between cache and DB at the expense of higher write latency.",
    hint: "Data passes 'through' the cache synchronously directly into the backing store."
  },
  {
    id: "sys-04",
    topic: "System Design & Cloud",
    subtopic: "Distributed Consensus & Raft",
    difficulty: 1.8,
    discrimination: 1.8,
    bloomLevel: "Analyze",
    question: "In the Raft consensus algorithm, how does the protocol prevent split-brain leader elections when multiple candidate nodes timeout concurrently?",
    codeSnippet: null,
    options: [
      "Candidates use randomized election timeouts (e.g., 150ms-300ms) and require a majority quorum of positive votes to become leader",
      "Nodes consult an external NTP clock server to synchronize election timestamps down to microseconds",
      "The node with the lowest IP address is deterministically selected as leader without voting",
      "Nodes run a two-phase commit protocol to agree on who will trigger the election"
    ],
    correctAnswer: "Candidates use randomized election timeouts (e.g., 150ms-300ms) and require a majority quorum of positive votes to become leader",
    explanation: "Raft breaks split votes by randomizing election timeouts so that one candidate times out first, increments the term, and collects majority quorum votes before competitors wake up. Requiring a strict majority quorum ensures at most one leader can be elected per term.",
    hint: "How does introducing jitter or randomization help avoid simultaneous candidate proposals?"
  },
  {
    id: "sys-05",
    topic: "System Design & Cloud",
    subtopic: "Database Partitioning & Consistent Hashing",
    difficulty: 2.3,
    discrimination: 1.9,
    bloomLevel: "Evaluate",
    question: "In a distributed key-value store using Consistent Hashing with virtual nodes (vnodes), what happens when a new storage node is added to the cluster?",
    codeSnippet: null,
    options: [
      "Only a fraction (1/N) of total keys are remapped and migrated, distributed evenly across existing nodes rather than causing a full cluster reshuffle",
      "All keys must be rehashed with modulo (N+1), requiring 100% of data to migrate",
      "The new node only handles write requests while existing nodes exclusively handle read replicas",
      "Virtual nodes must be completely dismantled and recreated via offline migration"
    ],
    correctAnswer: "Only a fraction (1/N) of total keys are remapped and migrated, distributed evenly across existing nodes rather than causing a full cluster reshuffle",
    explanation: "Traditional hash modulo `hash(key) % N` remaps nearly every key when N changes. Consistent hashing places keys and node tokens on a ring, so adding a node only affects adjacent ranges. Virtual nodes distribute these tokens uniformly, so each existing node relinquishes roughly 1/(N+1) of its load.",
    hint: "What is the primary advantage of Consistent Hashing over simple modulo hashing?"
  },

  // ==========================================
  // MACHINE LEARNING & AI
  // ==========================================
  {
    id: "ml-01",
    topic: "Machine Learning & AI",
    subtopic: "Supervised vs Unsupervised",
    difficulty: -1.9,
    discrimination: 1.1,
    bloomLevel: "Remember",
    question: "Which of the following is a primary characteristic of supervised learning?",
    codeSnippet: null,
    options: [
      "The training dataset contains ground-truth target labels for each input instance",
      "The model clusters data without any teacher intervention or prior target labels",
      "The model learns purely through trial-and-error rewards from an external environment",
      "The algorithm only works on image pixel data and rejects tabular text"
    ],
    correctAnswer: "The training dataset contains ground-truth target labels for each input instance",
    explanation: "Supervised learning algorithms are trained using labeled examples, such as an input vector paired with the desired target output (ground truth).",
    hint: "What makes the learning 'supervised' by a supervisor or ground truth?"
  },
  {
    id: "ml-02",
    topic: "Machine Learning & AI",
    subtopic: "Overfitting & Regularization",
    difficulty: -0.4,
    discrimination: 1.4,
    bloomLevel: "Understand",
    question: "A deep neural network achieves 99.8% accuracy on the training set but only 64.2% on the validation set. What phenomenon is occurring, and how can it be mitigated?",
    codeSnippet: null,
    options: [
      "Overfitting; mitigate using Dropout, L2 weight decay, and data augmentation",
      "Underfitting; mitigate by increasing model parameter count and learning rate",
      "Gradient explosion; mitigate by disabling batch normalization",
      "Data drift; mitigate by switching from cross-entropy loss to mean squared error"
    ],
    correctAnswer: "Overfitting; mitigate using Dropout, L2 weight decay, and data augmentation",
    explanation: "High training performance coupled with poor validation performance is the hallmark of overfitting (high variance). Regularization techniques like Dropout, L1/L2 penalty, early stopping, and data augmentation constrain model capacity to generalize better.",
    hint: "The model memorized training noise instead of general patterns."
  },
  {
    id: "ml-03",
    topic: "Machine Learning & AI",
    subtopic: "Transformer Attention Mechanism",
    difficulty: 1.1,
    discrimination: 1.7,
    bloomLevel: "Apply",
    question: "In the Scaled Dot-Product Attention formula `Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V`, why is the dot product divided by the square root of d_k?",
    codeSnippet: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V",
    options: [
      "To prevent dot products from growing excessively large for high dimensions, which would push softmax into regions with vanishingly small gradients",
      "To normalize the sequence length so variable length prompts can be batched together",
      "To convert the matrix product from quadratic O(N²) time complexity to linear O(N) complexity",
      "To invert the covariance matrix of Query and Key projections"
    ],
    correctAnswer: "To prevent dot products from growing excessively large for high dimensions, which would push softmax into regions with vanishingly small gradients",
    explanation: "For large key dimensions $d_k$, the dot products grow large in magnitude, driving the softmax function into regions where gradients are extremely tiny (gradient saturation). Scaling by $\\frac{1}{\\sqrt{d_k}}$ counteracts this effect.",
    hint: "What happens to the derivative of softmax when input logits have very large values?"
  },
  {
    id: "ml-04",
    topic: "Machine Learning & AI",
    subtopic: "Retrieval-Augmented Generation (RAG)",
    difficulty: 1.7,
    discrimination: 1.8,
    bloomLevel: "Analyze",
    question: "In production RAG systems, why is semantic vector similarity search often combined with BM25 keyword search (Hybrid Search) followed by a Cross-Encoder Reranker?",
    codeSnippet: null,
    options: [
      "Dense embeddings capture broad semantic intent while BM25 catches exact keyword/part-number matches; the cross-encoder computes full token-level query-document interactions without vector compression loss",
      "BM25 runs on GPU while vector search runs on CPU, providing automatic load balancing",
      "Cross-encoders reduce the memory footprint of dense embeddings by 75% via quantization",
      "Vector search is mathematically incapable of querying documents containing more than 512 tokens"
    ],
    correctAnswer: "Dense embeddings capture broad semantic intent while BM25 catches exact keyword/part-number matches; the cross-encoder computes full token-level query-document interactions without vector compression loss",
    explanation: "Dense vectors excel at semantic relationships but often fail on exact IDs, rare acronyms, and specific product codes where BM25 shines. Bi-encoders compress docs into single vectors losing cross-token interactions, so a Cross-Encoder reranker performs full joint attention on top candidates for optimal precision.",
    hint: "Consider what dense embeddings struggle to match compared to exact token lookups, and why bi-encoders are fast but less expressive than cross-encoders."
  },
  {
    id: "ml-05",
    topic: "Machine Learning & AI",
    subtopic: "LLM Alignment & RLHF / DPO",
    difficulty: 2.4,
    discrimination: 2.0,
    bloomLevel: "Evaluate",
    question: "How does Direct Preference Optimization (DPO) simplify language model alignment compared to traditional PPO-based Reinforcement Learning from Human Feedback (RLHF)?",
    codeSnippet: null,
    options: [
      "DPO mathematically expresses the reward function directly in terms of the policy likelihood ratio, eliminating the need to train a separate reward model or sample rollouts during reinforcement learning",
      "DPO uses supervised fine-tuning exclusively with synthetic data, removing human annotators completely",
      "DPO replaces gradient backpropagation with evolutionary genetic algorithms",
      "DPO enforces safety through hardcoded regex token masks during token generation"
    ],
    correctAnswer: "DPO mathematically expresses the reward function directly in terms of the policy likelihood ratio, eliminating the need to train a separate reward model or sample rollouts during reinforcement learning",
    explanation: "Rafailov et al. (2023) demonstrated that the optimal RL reward under the Bradley-Terry preference model can be solved analytically. DPO reparameterizes the loss directly using the implicit reward of the policy $\\pi_\\theta(y|x)$ relative to reference $\\pi_{ref}(y|x)$, bypassing the unstable actor-critic PPO loop and separate reward model training.",
    hint: "Think about why training RL with PPO requires an actor, critic/reward model, and online generation, whereas DPO uses a closed-form substitution."
  },

  // ==========================================
  // PYTHON & BACKEND SYSTEMS
  // ==========================================
  {
    id: "py-01",
    topic: "Python & Backend Systems",
    subtopic: "List Comprehensions & Mutability",
    difficulty: -1.6,
    discrimination: 1.2,
    bloomLevel: "Remember",
    question: "What is the result of evaluating `[x * 2 for x in range(4)]` in Python?",
    codeSnippet: "[x * 2 for x in range(4)]",
    options: ["[0, 2, 4, 6]", "[2, 4, 6, 8]", "[0, 1, 2, 3]", "[0, 2, 4]"],
    correctAnswer: "[0, 2, 4, 6]",
    explanation: "`range(4)` generates integers 0, 1, 2, 3. Multiplying each by 2 yields 0, 2, 4, 6.",
    hint: "Recall that `range(4)` starts at 0 and stops before 4."
  },
  {
    id: "py-02",
    topic: "Python & Backend Systems",
    subtopic: "GIL & Concurrency",
    difficulty: 0.2,
    discrimination: 1.5,
    bloomLevel: "Understand",
    question: "Why does standard CPython's Global Interpreter Lock (GIL) prevent multi-threaded CPU-bound programs from achieving speedups across multi-core processors?",
    codeSnippet: null,
    options: [
      "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously",
      "Python threads are green threads that cannot interface with operating system kernel schedulers",
      "CPython assigns all thread memory allocations to a single fixed CPU cache line",
      "The GIL shuts down CPU cores when temperature exceeds safe thresholds"
    ],
    correctAnswer: "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously",
    explanation: "CPython's memory management is not thread-safe (reference counting). The GIL ensures only one native thread executes Python bytecode at any given moment, making threading ineffective for CPU-bound tasks (which should use `multiprocessing` instead).",
    hint: "What does the 'L' in GIL stand for, and what resource does it guard?"
  },
  {
    id: "py-03",
    topic: "Python & Backend Systems",
    subtopic: "Generators & Memory Efficiency",
    difficulty: 0.7,
    discrimination: 1.6,
    bloomLevel: "Apply",
    question: "What is the primary architectural benefit of using a generator expression with `yield` instead of returning a complete list when processing a 10 GB log file?",
    codeSnippet: "def process_logs(file_path):\n    with open(file_path) as f:\n        for line in f:\n            if 'ERROR' in line:\n                yield parse_line(line)",
    options: [
      "Lazy evaluation: lines are streamed on-demand without buffering the entire 10 GB file into RAM",
      "Generators execute in C rather than Python, making file I/O 100x faster",
      "The `yield` statement automatically parallelizes execution across all available CPU threads",
      "Generators encrypt the file stream in memory to prevent heap inspection"
    ],
    correctAnswer: "Lazy evaluation: lines are streamed on-demand without buffering the entire 10 GB file into RAM",
    explanation: "Generators use lazy evaluation, retaining state and yielding items one at a time on demand. This maintains O(1) memory footprint rather than allocating gigabytes of RAM to store an entire materialized list.",
    hint: "Consider the difference between eager memory materialization and lazy streaming."
  },
  {
    id: "py-04",
    topic: "Python & Backend Systems",
    subtopic: "Asyncio Event Loop & Coroutines",
    difficulty: 1.6,
    discrimination: 1.8,
    bloomLevel: "Analyze",
    question: "What happens if a developer executes a synchronous `time.sleep(5)` call inside an `async def` FastAPI route handler?",
    codeSnippet: "@app.get('/metrics')\nasync def get_metrics():\n    time.sleep(5)  # Synchronous blocking call\n    return {'status': 'ok'}",
    options: [
      "It blocks the entire single-threaded asyncio event loop, halting all concurrent request processing for 5 seconds",
      "FastAPI automatically offloads `time.sleep` to an asynchronous worker thread pool",
      "The event loop cancels the coroutine and throws a `ConcurrencyTimeoutException`",
      "Only that single HTTP connection waits, while other connections continue unaffected"
    ],
    correctAnswer: "It blocks the entire single-threaded asyncio event loop, halting all concurrent request processing for 5 seconds",
    explanation: "In an `async def` handler, code executes directly on the main event loop thread. A synchronous blocking call like `time.sleep` freezes the entire loop, preventing other pending coroutines from executing. Non-blocking sleep must use `await asyncio.sleep(5)` or be run via `run_in_threadpool`.",
    hint: "Does `time.sleep` yield control back to the asyncio event loop?"
  },
  {
    id: "py-05",
    topic: "Python & Backend Systems",
    subtopic: "Metaclasses & Descriptors",
    difficulty: 2.2,
    discrimination: 1.9,
    bloomLevel: "Evaluate",
    question: "In Python, which dunder method protocols must an object implement to act as an owner-aware descriptor that intercepts attribute lookups and assignments on class instances?",
    codeSnippet: null,
    options: [
      "`__get__`, `__set__`, and optionally `__set_name__` and `__delete__`",
      "`__getattr__`, `__setattr__`, and `__delattr__`",
      "`__enter__`, `__exit__`, and `__call__`",
      "`__new__`, `__init__`, and `__repr__`"
    ],
    correctAnswer: "`__get__`, `__set__`, and optionally `__set_name__` and `__delete__`",
    explanation: "Python's descriptor protocol defines how attributes are retrieved, modified, or deleted from an instance via `__get__(self, obj, type=None)`, `__set__(self, obj, value)`, and `__delete__(self, obj)`. Python 3.6+ introduced `__set_name__(self, owner, name)` to automatically bind the attribute name.",
    hint: "Look for the protocol containing `__get__` and `__set__` used by properties and ORM fields."
  }
];

export const TOPICS = [
  { id: "all", name: "Comprehensive Full-Stack & Engineering", description: "Multi-domain assessment spanning algorithms, architecture, AI, and systems" },
  { id: "dsa", name: "Data Structures & Algorithms", description: "Complexity, search, dynamic programming, graphs, and tree structures" },
  { id: "web", name: "Web Development & JavaScript", description: "Modern JS runtime, event loop, React rendering, performance, and security" },
  { id: "sys", name: "System Design & Cloud", description: "Distributed consensus, caching, microservices, CAP theorem, and scalability" },
  { id: "ml", name: "Machine Learning & AI", description: "Transformers, attention, RAG, alignment, loss functions, and optimization" },
  { id: "py", name: "Python & Backend Systems", description: "Concurrency, asyncio, GIL, memory models, and API architectures" }
];

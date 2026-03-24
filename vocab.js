/**
 * vocab.js — Custom keywords for Deepgram Nova-2
 * Covers JavaScript, React, Node.js, Python, SQL, DevOps, and general CS terms.
 * Pass these as `keywords` to the Deepgram live connection to dramatically
 * improve transcription accuracy for technical speech.
 *
 * Format: "word:boost" — boost is 1–10, higher = stronger preference.
 * Use higher boosts for terms that sound like common words.
 */

export const VOCAB = [
  // JavaScript core
  'JavaScript:5','TypeScript:5','ECMAScript:5','ESModules:5',
  'async:3','await:3','Promise:3','callback:3','closure:3','prototype:3',
  'useState:10','useEffect:10','useRef:10','useCallback:10','useMemo:10','useReducer:10','useContext:10',
  'useLayoutEffect:10','forwardRef:10','createContext:10',
  'querySelector:8','addEventListener:8','preventDefault:8','stopPropagation:8',
  'forEach:5','map:2','filter:3','reduce:5','flatMap:8','findIndex:8',
  'destructuring:8','spread:3','rest:3','nullish:8','coalescing:8','optional:3','chaining:5',
  'hoisting:8','lexical:5','scope:3','closure:5','IIFE:10','memoization:8',

  // React
  'React:3','ReactDOM:8','JSX:8','TSX:8','props:3','state:3','ref:3',
  'component:3','lifecycle:5','reconciliation:8','virtual:3','DOM:3','diffing:8',
  'hydration:8','suspense:8','Suspense:8','lazy:3','Lazy:5',
  'Redux:5','Zustand:8','Recoil:8','Jotai:8','Valtio:8',
  'React Router:8','Next.js:8','NextJS:8','Remix:5','Gatsby:5',
  'Vite:8','webpack:5','Rollup:8','esbuild:8','Turbopack:8',
  'Tailwind:5','styled-components:8','Emotion:5','CSS-in-JS:8',

  // Node.js
  'Node:3','NodeJS:5','npm:5','npx:8','pnpm:8','yarn:3',
  'Express:5','Fastify:8','Koa:5','Hono:8','NestJS:8',
  'middleware:5','routing:3','endpoint:3','REST:3','GraphQL:5','tRPC:10',
  'WebSocket:8','Socket.io:8','SSE:8','streaming:3',
  'Prisma:8','Drizzle:8','Sequelize:5','TypeORM:8','Mongoose:5',
  'JWT:8','OAuth:8','bcrypt:8','passport:5',
  'dotenv:8','nodemon:8','PM2:8','Docker:5','Kubernetes:5',

  // Python
  'Python:3','pip:5','PyPI:8','virtualenv:8','venv:8','conda:5',
  'Flask:5','Django:5','FastAPI:8','Pydantic:8','SQLAlchemy:8',
  'async def:8','await:3','asyncio:8','Celery:8','Redis:5',
  'NumPy:8','Pandas:8','Matplotlib:8','Scikit-learn:8','TensorFlow:8','PyTorch:8',
  'decorator:5','generator:5','comprehension:5','lambda:3',
  'pytest:8','unittest:8','mock:3','fixture:5',

  // Databases / SQL
  'SQL:5','NoSQL:8','PostgreSQL:8','MySQL:5','SQLite:8','MongoDB:5',
  'Redis:5','Elasticsearch:8','DynamoDB:8','Supabase:8','Firebase:5',
  'JOIN:3','INNER JOIN:8','LEFT JOIN:8','GROUP BY:5','ORDER BY:5','WHERE:2',
  'transaction:5','migration:5','schema:3','index:3','query:3',
  'ORM:8','N+1:8','eager:3','lazy:3','loading:3',

  // CS fundamentals
  'algorithm:5','Big O:8','O(n):8','O(log n):8','O(n squared):8',
  'array:3','linked list:8','hash map:8','hash table:8','binary tree:8',
  'stack:3','queue:3','heap:3','graph:3','trie:8',
  'recursion:5','memoization:8','dynamic programming:8','greedy:5',
  'bubble sort:8','merge sort:8','quicksort:8','binary search:8',
  'depth first:8','breadth first:8','DFS:8','BFS:8',

  // Git / DevOps
  'Git:3','GitHub:3','GitLab:5','PR:5','pull request:8','merge:3','rebase:5',
  'CI/CD:8','GitHub Actions:8','Docker:5','Dockerfile:8','container:5',
  'Kubernetes:5','kubectl:10','Helm:8','Terraform:8',
  'AWS:3','EC2:8','S3:5','Lambda:5','CloudFront:8','RDS:8',
  'Vercel:8','Netlify:8','Railway:8','Render:8',

  // Testing
  'Jest:8','Vitest:8','Playwright:8','Cypress:5','Puppeteer:8',
  'unit test:5','integration test:8','end-to-end:8','E2E:8','TDD:8',
  'mock:3','stub:5','spy:3','assertion:5','snapshot:5','coverage:5',

  // APIs / Protocols
  'API:3','REST:3','GraphQL:5','gRPC:10','WebSocket:8','HTTP:3','HTTPS:3',
  'GET:3','POST:3','PUT:3','PATCH:5','DELETE:3','CRUD:8',
  'JSON:3','XML:3','YAML:5','protobuf:8',
  'rate limiting:8','pagination:5','authentication:5','authorization:5',

  // AI / ML
  'LLM:8','GPT:5','Claude:5','Anthropic:8','OpenAI:8','Gemini:8',
  'embedding:5','vector:3','RAG:8','fine-tuning:8','prompt:3','token:3',
  'Langchain:8','LlamaIndex:8','Ollama:8',

  // General CS terms often mangled by STT
  'boolean:5','boolean:5','null:3','undefined:5','NaN:8','Infinity:5',
  'instantiate:8','instantiation:8','polymorphism:8','encapsulation:8','inheritance:5',
  'interface:5','abstract:5','singleton:8','factory:5','observer:5',
  'idempotent:10','immutable:8','mutable:5','deterministic:8',
  'serialization:8','deserialization:8','marshalling:10',
  'concurrency:8','parallelism:8','race condition:8','deadlock:8','mutex:10',
  'garbage collection:8','memory leak:8','heap:5','stack overflow:8',
  'regex:8','regexp:8','linting:8','transpiling:8','polyfill:8','shim:8',
];

/** Returns the keywords array formatted for Deepgram SDK */
export const DEEPGRAM_KEYWORDS = VOCAB;

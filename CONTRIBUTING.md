# Coding Guidelines

Conventions for this codebase. The goal is that any file you open looks like
every other file, and that the tooling — not review comments — catches slips.

## Folder structure

```
src/
├── app/          # Store wiring: configureStore, baseApi, typed hooks
├── components/
│   ├── ui/       # Generic, reusable primitives (Button, Input, Select…)
│   └── layout/   # App shell: Sidebar, Topbar, PageHeader, Breadcrumbs
├── features/     # Vertical slices — one folder per domain
│   ├── auth/
│   ├── tests/
│   ├── questions/
│   └── taxonomy/ # subjects → topics → sub-topics
├── hooks/        # Cross-cutting hooks used by more than one feature
├── lib/          # Framework-free helpers (env, storage, formatters, cn)
├── pages/        # Route components — compose features, hold no logic
├── routes.tsx    # Route table, guard, error boundary — one file
└── types/        # Shared domain types
```

### Where does a file go?

Prefer a single file over a folder until it actually needs to grow. `routes.tsx`
holds the route table, guard, and error boundary together because tracing one
route across six small files costs more than it saves.

- Used by one feature → that feature's folder.
- Used by two or more features → `components/ui`, `hooks`, or `lib`.
- Talks to the network → `features/<x>/<x>Api.ts`.
- Pure and framework-free → `lib/`.

A feature folder owns its slice end to end:

```
features/tests/
├── testsApi.ts        # RTK Query endpoints, injected into baseApi
├── testSchema.ts      # Zod schema + inferred form types
├── TestForm.tsx       # Components
└── index.ts           # Public surface — other features import only from here
```

**Features never reach into each other's internals.** Import from
`@/features/tests`, never `@/features/tests/testsApi`. Anything not exported
from `index.ts` is private to that feature.

## Imports

Always use the `@/` alias — no `../../` chains.

```ts
import { Button } from '@/components/ui'   // ✅
import { Button } from '../../components/ui' // ❌
```

Type-only imports must be marked (enforced by lint):

```ts
import type { Test } from '@/types'
```

## TypeScript

- **No `any`** — lint error. Use `unknown` and narrow it.
- No non-null assertions (`!`) — handle the null branch. `main.tsx` shows the pattern.
- `noUncheckedIndexedAccess` is on, so `array[0]` is `T | undefined`. Check before use.
- Types describing API payloads live in `src/types`; form types are inferred
  from their Zod schema via `z.infer`, never hand-written twice.

## Components

- Function declarations, not arrow consts: `export function Button() {}`.
- Props typed inline as an interface named `<Component>Props`.
- Pages are thin: fetch data, compose feature components, no business logic.
- One component per file. Colocate only if a subcomponent is genuinely private.

## Data fetching

All server state goes through RTK Query — never `useEffect` + `fetch`.
Endpoints are injected per feature:

```ts
export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query<Test[], void>({
      query: () => '/tests',
      transformResponse: (res: ApiEnvelope<Test[]>) => res.data,
      providesTags: ['Test'],
    }),
  }),
})
```

Two rules that keep cache behaviour predictable:

- `transformResponse` unwraps the `{ status, message, data }` envelope so
  components only ever see domain objects.
- Mutations declare `invalidatesTags` matching the queries they affect, so
  lists refresh without manual refetching.

Auth headers and 401 handling live in `app/baseApi.ts` — don't repeat them.

## Forms

React Hook Form + Zod, with the schema as the single source of truth:

```ts
const schema = z.object({ name: z.string().min(1, 'Test name is required') })
type FormValues = z.infer<typeof schema>
```

Validation messages belong in the schema, not scattered in JSX.

## Styling

Tailwind utilities against the tokens in `src/index.css`, which were extracted
from the Figma file. Use the semantic token names — `text-ink-500`,
`border-line`, `bg-brand-600` — rather than raw Tailwind colours like
`text-gray-500`, so a token change propagates everywhere.

Use `cn()` from `@/lib/cn` for conditional classes.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Components / files | PascalCase | `TestForm.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Non-component files | camelCase | `testsApi.ts` |
| Constants | SCREAMING_SNAKE | `STORAGE_KEYS` |
| Booleans | `is` / `has` / `can` prefix | `isSubmitting` |

## Comments

Comment **why**, not what. Explain non-obvious decisions, workarounds, and
API quirks — skip narrating code that already reads clearly.

## Before committing

```bash
npm run validate   # typecheck + lint + format check
```

`npm run format` fixes formatting; `npm run lint:fix` fixes autofixable rules.

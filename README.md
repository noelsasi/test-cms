# Preproute — Test Management CMS

A test management application for creating, editing, and publishing MCQ tests.
Built with React + TypeScript against the Preproute staging API.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

Login with the provided staging credentials (`vedant-admin` / `vedant123`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | Lint with oxlint |
| `npm run format` | Format with Prettier |
| `npm run validate` | Typecheck + lint + format check |

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite | Fast HMR, minimal config, simple static deploy |
| Language | TypeScript (strict) | Catches API-shape mistakes at compile time |
| Routing | React Router 7 | Nested routes and a clean guard pattern |
| Server state | RTK Query | Caching, tag invalidation, and loading/error states without hand-rolled `useEffect` |
| Forms | React Hook Form + Zod | Uncontrolled inputs (fewer re-renders) with one schema as the source of truth |
| Styling | Tailwind CSS v4 | Design tokens from Figma declared once in `@theme` |
| Linting | oxlint + Prettier | Fast, and enforces the conventions in CONTRIBUTING.md |

## Architecture

Feature-sliced: each domain owns its API endpoints, schemas, and components,
and exposes a single public barrel. Pages compose features and hold no business
logic. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full conventions.

```
src/
├── app/          # Store, RTK Query base API, typed hooks
├── components/   # ui/ primitives, layout/ app shell
├── features/     # auth, tests, questions, taxonomy
├── lib/          # env, storage, formatters, cn
├── pages/        # Route components
├── routes.tsx    # Route table, guard, error boundary
└── types/        # Shared domain types
```

### API notes

Base URL is configured via `VITE_API_BASE_URL`.

Two things worth flagging, both verified against the live staging API:

- Responses are wrapped as `{ status: "success", message, data }` — note this
  differs from the task document, which specifies `success: true`. Endpoints
  unwrap the envelope in `transformResponse`.
- `GET /tests` returns `subject` and `topics` as **display names**, while
  `POST`/`PUT` expect **UUIDs**. Edit prefill has to map names back to ids.

Auth is a JWT in `Authorization: Bearer <token>`, attached centrally in
`app/baseApi.ts`. A 401 clears the stored session and redirects to login.

## Build status

Scaffolding and conventions are in place; the five screens are being
implemented in sequence.

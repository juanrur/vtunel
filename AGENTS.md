# AGENTS.md — Vtunel

## What this is
Calendar app (Next.js + PocketBase + Zustand). Note: README says "Supabase" but the actual backend is **PocketBase**.

## Developer commands
- `npm install` — install deps
- `npm run dev` — Next.js dev server (default port 3000)
- `npm run dev:db` — start local PocketBase from `./db` using `dotenv` (uses `POCKETBASE_URL` from `.env`)
- `npm run build` — standalone Next.js build (`output: 'standalone'` in `next.config.mjs`)
- `npm run start` — run production standalone server
- `npm run lint` — ESLint (`next/core-web-vitals` + `standard`)

## Local setup flow
1. `npm install`
2. `npm run dev:db` (starts PocketBase, uses `.env` for config)
3. In another shell: `npm run dev`
4. Open http://localhost:3000

PocketBase local URL is set in `.env` as `POCKETBASE_URL=http://localhost:8090`. The docker-compose setup overrides this to `http://db:8080`.

## Architecture
- `app/` — Next.js App Router. Pages live under `app/(app)/` (group route with shared layout). `app/login/page.tsx` and `app/auth/github/*` handle OAuth.
- `modules/` — domain modules:
  - `modules/events/` — events repository + Zustand store
  - `modules/tasks/` — tasks repository + store
  - `modules/templates/` — templates repository + store
  - `modules/ui/` — React components
  - `modules/shared/` — PocketBase client, repository interface, utilities
- `db/` — PocketBase migrations, schema, and Dockerfile

State pattern: Zustand stores are the single source of truth for UI state. They call PocketBase repositories, mutate local state optimistically or immediately, then persist to DB.

## Key conventions
- Path aliases in `tsconfig.json`:
  - `@/*` → `app/*`
  - `@events/*`, `@tasks/*`, `@templates/*`, `@ui/*`, `@shared/*`, `@icons/*` → `modules/*`
- ESLint extends `standard` (semicolons are not required, camelCase enforced, etc.). `pocketbase-events-repository.ts` disables `camelcase` for DB field mapping.
- The project uses **space-before-function-paren** style and no semicolons (standard JS style).
- All entity repositories implement `CrudRepository<T>` from `modules/shared/domain/crud-repository.ts`.
- Date fields come from PocketBase as `start_time`/`end_time` and are mapped to domain `startTime`/`endTime` in `pocketbase-events-repository.ts`.

### UI component naming
- Route pages live in `app/(app)/<route>/page.tsx` and import the feature's entry component from `modules/ui/<feature>/components/`.
- The entry component can be named like the feature (e.g. `modules/ui/schedule/components/schedule.tsx`, `modules/ui/calendar/components/calendar.tsx`).
- Subcomponents inside the same feature do **not** repeat the feature name. Use short names: `item.tsx`, `gap.tsx`, `day.tsx`, `config.tsx`, `header.tsx`.
- Avoid custom `useXxx` hooks. Prefer state managed by a Zustand store (`store.ts`) or local component state with helpers in `state.ts`/`utils.ts`. If you need a hook on top of a Zustand store, define both the store and the hook in the same file (e.g. `modules/ui/<feature>/store.ts`).

## Auth
- GitHub OAuth via PocketBase's OAuth2 provider.
- `middleware.ts` redirects unauthenticated users to `/login` except for `/login`, `/api/*`, `/auth/*`, and Next.js static files.
- `app/auth/github/route.ts` redirects to GitHub; `app/auth/github/callback/route.ts` completes the flow and stores `pb_auth` cookie (non-httpOnly).
- Client-side auth state is loaded from `document.cookie` into the PocketBase client in `modules/shared/pocketbase/client.ts`.

## PocketBase / backend
- `db/Dockerfile` downloads PocketBase v0.39.6 and applies migrations from `db/pb_migrations/`.
- `db/pb_schema.json` is the schema dump and is the source of truth for collections.
- Migrations include OAuth setup (`1784000000_configure_oauth.js`) and collections for users, events, tasks, and templates.
- To run the whole stack: `docker-compose up --build` (app + db).
- Production variant: `docker-compose -f docker-compose.prod.yml up --build` (no host port exposed for db).

## Next.js config quirks
- `next.config.mjs` uses `output: 'standalone'`.
- Rewrites proxy `/api/:path*` to `${POCKETBASE_URL}/api/:path*`. This means the browser client uses `new PocketBase('/')` and `/api/...` calls hit the proxy.
- `process.env.POCKETBASE_URL` must be present at build time for the rewrite to be configured correctly (Docker build passes it as an ARG).

## Testing / verification
- There are no test scripts or test framework installed (`npm run lint` is the only verification step).
- Before committing, run `npm run lint`.

## Environment variables
- `POCKETBASE_URL` — required for both Next.js and Docker. Default in `.env`: `http://localhost:8090`.
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` — required for GitHub OAuth. The `.env` file contains real values; do not commit it (it is gitignored).

## Things to watch
- `db/pb_data/` is gitignored. Local PocketBase data is not committed.
- `README.md` is stale (mentions Supabase). `package.json` and `db/` are the truth: backend is PocketBase.
- `npm run dev:db` only works if you have the PocketBase binary or use the Docker path. On the host, `dotenv` runs `./db/pocketbase serve` — the binary in `db/` is `pocketbase.exe`, which may not be executable on Linux. Use the Docker setup or install a native PocketBase binary when developing locally.
- The `.env` file is committed by the repo currently (not ignored), but `.gitignore` does list `.env`. Verify before committing secrets.

## If you need to add a domain
1. Add types in `modules/<domain>/types.ts`.
2. Add a PocketBase repository in `modules/<domain>/pocketbase-<domain>-repository.ts` implementing `CrudRepository<T>`.
3. Add a Zustand store in `modules/<domain>/store.ts`.
4. Add UI under `modules/ui/<feature>/`.
5. Add a `pb_migrations` migration or update `db/pb_schema.json` to reflect the collection.

## Agent permissions
The following actions require explicit confirmation from the user before proceeding:
- Creating git commits, amending commits, pushing, or any other git mutation.
- Installing or downloading dependencies (`npm install`, `npm ci`, etc.).
- Downloading anything from the internet (binaries, images, packages, data, etc.).

Always ask first. Do not run these silently.

## References
- `package.json` — scripts and deps
- `next.config.mjs` — rewrites / standalone output
- `middleware.ts` — auth routing
- `tsconfig.json` — path aliases
- `db/pb_schema.json` — PocketBase schema
- `db/Dockerfile` — backend image build
- `docker-compose.yml` — full local stack
- `README.md` — high-level product description (but backend stack is wrong)
- `TODOS.md` — backlog of pending tasks

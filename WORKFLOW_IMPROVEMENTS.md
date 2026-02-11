# Lumina – Project overview & improvement workflow

## What this project is

**Lumina** is an elite companionship platform built with:

- **Next.js 16** (App Router), **TypeScript**, **Prisma** (SQLite dev), **NextAuth v5** (credentials)
- **Features**: Home (featured models), Search (filter by country/city), model detail pages, Locations (static list), News (external feeds), Login/Register, shared Navbar/Footer

**Data model**: `User` (role CLIENT/MODEL), `ModelProfile` (bio, location, rate, photos, services), `Booking`, `Review`. Enums are stored as strings for SQLite.

---

## Improvement workflow (prioritized)

Use this as a checklist. Order is by impact and dependency.

---

### Phase 1 – Consistency & correctness (do first)

| # | Task | Why |
|---|------|-----|
| 1 | **Use single Prisma instance everywhere** | `src/lib/prisma.ts` already exports a singleton (avoids multiple connections in dev). Replace `new PrismaClient()` in: `src/app/page.tsx`, `src/app/search/page.tsx`, `src/app/models/[id]/page.tsx`, `src/app/api/models/route.ts` with `import { prisma } from "@/lib/prisma"`. |
| 2 | **Make search filters work reliably** | Search page reads `searchParams` but the filter form has no `method` or `action`. Add `method="get"` and `action="/search"` to the form so submit updates the URL and refetches with filters. |
| 3 | **NextAuth session types** | Session callback sets `session.user.id = token.sub`. Add a `types/next-auth.d.ts` (or in `src`) to extend `Session` and add `id` to `User` so TypeScript and IDE are correct. |
| 4 | **Optional: turn off Prisma query log in production** | In `src/lib/prisma.ts`, use `log: process.env.NODE_ENV === "development" ? ["query"] : []` so production doesn’t log every query. |

---

### Phase 2 – UX & features

| # | Task | Why |
|---|------|-----|
| 5 | **Price filter on search page** | API route `api/models` already supports `minPrice` / `maxPrice`. Add two inputs in the search sidebar and pass them in the form (e.g. `name="minPrice"`, `name="maxPrice"`) so the page uses them. |
| 6 | **Locations → search** | On `/locations`, make each city/country a link to `/search?country=...` or `/search?city=...` so users can jump from locations to filtered results. |
| 7 | **Model detail: verified badge only when verified** | In `models/[id]/page.tsx`, the “Verified” badge is always shown. Render it only when `model.isVerified === true`. |
| 8 | **Booking flow (later)** | “Request Booking” is a static button. When ready: add a server action or API that creates a `Booking` (with `clientId` from session), then a confirmation/thank-you step. |

---

### Phase 3 – Quality & DX

| # | Task | Why |
|---|------|-----|
| 9 | **Env template** | Add `.env.example` with `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` (and any other required vars). Keep `.env` in `.gitignore` (it already is). |
| 10 | **Scripts** | In `package.json`, add `"typecheck": "tsc --noEmit"` and optionally `"lint:fix": "eslint --fix"`. Run typecheck in CI (see below). |
| 11 | **CI** | In `.github/workflows/ci-cd.yml`, add a step like `run: npx tsc --noEmit` (or `npm run typecheck`) after install so PRs fail on type errors. |
| 12 | **Tests (optional but recommended)** | Add Vitest + React Testing Library. Start with: one test for a key server action (e.g. auth or register) and one for a main page (e.g. home or search). |

---

### Phase 4 – Data & production readiness

| # | Task | Why |
|---|------|-----|
| 13 | **Indexes** | If search or list pages get slow, add Prisma indexes on `ModelProfile`: e.g. `@@index([isVerified, country, city])`, `@@index([hourlyRate])`. |
| 14 | **Enums** | Schema comment says enums were removed for SQLite. When moving to PostgreSQL, reintroduce `Role`, `BookingStatus` (and use them in `User` and `Booking`) for type safety and DB constraints. |
| 15 | **Deploy** | Replace “Simulate Deployment” in CI with a real deploy (e.g. Vercel, Railway) and set env vars in the host. |

---

## Quick reference – file touchpoints

- **Prisma singleton**: `src/lib/prisma.ts`
- **Pages that use Prisma**: `src/app/page.tsx`, `src/app/search/page.tsx`, `src/app/models/[id]/page.tsx`
- **API using Prisma**: `src/app/api/models/route.ts`
- **Auth config**: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- **Search form**: `src/app/search/page.tsx` (form in sidebar)
- **Locations**: `src/app/locations/page.tsx`
- **CI**: `.github/workflows/ci-cd.yml`

---

## Suggested order for one session

1. Phase 1: Prisma singleton (1), search form `method`/`action` (2), NextAuth types (3).
2. Phase 2: Price filter (5), locations links (6), conditional verified badge (7).
3. Phase 3: `.env.example` (9), `typecheck` script and CI (10–11).

After that, add tests and booking flow when you’re ready to extend functionality.

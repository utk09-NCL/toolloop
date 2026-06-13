# ToolLoop - Agent Reference

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## What it is

Neighborhood tool-lending webapp. Borrow tools from people nearby. No money, no real auth, no complexity.

## Stack

- Next.js 16, App Router, TypeScript strict
- SQLite + Prisma 7 + libsql adapter
- Server Actions ONLY - no API routes, no client-side fetching
- Plain CSS + CSS Modules, no Tailwind, no MUI, no component libraries
- Zod 4 Validation, Biome 2 linting
- Demo auth via HTTP-only cookie (`toolloop_user`)

## Architecture

```text
UI -> Server Actions (Next.js) -> Domain (pure policy) -> Prisma
```

- **Reads**: async Server components query Prisma directly
- **Writes**: Server Actions -> Zod validation -> Domain check -> `$transaction` -> `revalidatePath` -> return result
- **Domain layer** (`src/lib/domain`): pure functions, no I/O, no framework imports - all business rules live here
- **Actions are thin**: orchrestrate only, no rules, no raw SQL
- **Components are dumb**: render and dispatch only, never decide policy

## Setup

```bash
npm install # ensure on Node 22

# generate schema and seed data
npx prisma migrate dev
npx prisma generate
npx prisma db seed

npm run dev
```

Reset to clean state: `npm run db:reset`

## Key invariants

- Tool `available` and `BorrowRequest.status` must never drift - always mutate both in one `$transaction`
- A user cannot request they own tool or an unavailable tool
- Approve: request -> APPROVED + roool -> Unavailable (atomic)
- Return: request -> RETURNED + tool -> Available (atomic), via OTP only
- Cancel: borrower cancels PENDING only, no OTP needed, tool availability unchanged
- Contact PII (email, phone, address) never rendered on public pages

## Data models

- `User` -> owns `Tool`s, makes `BorrowRequest`s, has `Favorite`s
- `Tool` -> has `BorrowRequest`s, has `Favorite`s, has `ToolReport`s
- `BorrowRequest` -> status: `PENDING -> APPROVED / REJECTED -> RETURNED / CANCELLED`, has `RequestEvent`s
- `Favorite` -> `@@unique([userId, toolId])` - enforces toggle idempotency at DB level
- `RequestEvent` -> append-only audit log, writtem in same transaction as status change
- `ToolReport` -> private flag to tool owner, never public, never a score

## Folder conventions

- `src/lib/domain/` - pure business rules
- `src/actions/` - thin Server Actions
- `src/components/ui/` - styked primitives
- `src/lib/db.ts` - Prisma client singleton (globalThis guard)
- `src/lib/session.ts` - `getCurrentUser()`, only place identity is resolved
- `src/lib/constants.ts` - ENUM -> label maps, never render raw enum strings
- CSS Modules co-located with each component, all values reference `:root` tokens in `globals.css`

## Routes

| Route | Type | What it does |
| ----- | ----- | ------------------------------ |
| `/` | RSC | Home page, hero, how it works, CTA |
| `/browse` | RSC | Tool grid, filters via URL query params (`category`, `neighbourhood`, `availabl`, `q`) |
| `/tool/[id]` | RSC | Tool detail, photo, owner info, rules, request button |
| `/tools/new` | RSC + Action | Tool creation form, submit -> create tool, redirect to `/tool/[id]` |
| `/dashboard` | RSC | Owner's tools + incoming requests, approve/reject/return |
| `/borrows` | RSC | Borrower's PENDING + APPROVED requests, CANCEL + OTP Return |
| `/saved` | RSC | Borrower's saved tools, toggle favorite |

## Component and action conventions

- **Server vs Client**: Server component by default. Add `"use client"` only when the component needs `onClick`, `onChange`, `useState`, `useEffect`, etc. If in doubt, it is a Server component.

- **Action retun shape**: Every action returns `{ ok: true } | { ok: false, error: string }`. Client components check `result.ok` and render `result.error` inline near the reiggering control. Never throw from an action - always return a structured result.

- **Naming**: Action names are verbs (`createTool`, `approveBorrowRequest`, `toggleFavorite`). Call `revalidatePath` after every successful mutation that changes a visible page. Component names are nouns (`ToolCard`, `BorrowRequestList`, `DashboardPage`).

## What NOT to build

- Payments
- Rating/Reviews
- Image uploads
- Real auth (email/password, OAuth, etc.)
- Real-time chat
- In-App AI
- Multi-tenant (multiple neighborhoods, organizations, etc.) features

## Prisma 7 gotchas

- `DATABASE_URL` goes in `prisma.config.ts`, not in `schema.prisma`
- Run `npx prisma generate` manually after every `migrate dev`
- Seed file must be `.mts` (ESM) to avoid CJS clash with libsql adapter
- Use `@default(uuid())` for UUID primary keys, cuid2 is not available

## Every commit must

- Pass `npm run lint` (Biome 2)
- Pass `npm run build` with NO type errors
- Have a new caveman-styled block appended to `checkpoint.txt` with a short description of the change
- Be reachable via UI, not just in code
- Leave empty/loading/error states on every list surface (no blank pages)

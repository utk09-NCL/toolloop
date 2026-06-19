# ToolLoop

- ToolLoop is a neighborhood tool-lending web application where people can share and borrow tools from others nearby.
- The project focuses on simple borrowing workflows without payments, real authentication, ratings, or other marketplace complexity.

## Stack

- Next.js 16 (App Router)
- SQLite + Prisma 7
- Server Actions
- CSS Modules
- Vitest

## Setup

```bash
npm install

npx prisma migrate dev
npx prisma generate
npx prisma db seed

npm run dev
```

> Note: DATABASE_URL goes in prisma.config.ts, not .env or schema.prisma.



## Reset Database


```bash

npm run db:reset 
```


## Available Scripts

```bash
npm run dev 
npm run build 
npm run lint
npm run test 
npm run test:watch 
```


## Route Map

| Route | Type | Description |
|--------|--------|--------|
| `/` | RSC | Home page |
| `/browse` | RSC | Browse available tools |
| `/tool/[id]` | RSC | Tool details |
| `/tools/new` | RSC + Action | Create a tool |
| `/dashboard` | RSC | Owner dashboard |
| `/borrows` | RSC | Borrow requests |
| `/saved` | RSC | Saved tools |

## Testing

Testing documentation is currently being expanded.

For testing guidance, refer to TESTS.md and the active testing issues. This section will be updated after the Vitest infrastructure and testing document work is completed.

## Documentation

AGENTS.md is the authoritative reference for architecture, conventions, workflows, and development guidelines.


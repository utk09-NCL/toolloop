# ToolLoop

-> ToolLoop is a neighborhood tool-lending web application where people can share and borrow tools from others nearby.
-> The project focuses on simple borrowing workflows without payments, real authentication, ratings, or other marketplace complexity.

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

```md
> Note: DATABASE_URL goes in prisma.config.ts, not .env or schema.prisma.


## Reset Database

```bash
npm run db:reset

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test 
npm run test:watch

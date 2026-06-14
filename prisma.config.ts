import { defineConfig } from "prisma/config";

const DB_URL = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DB_URL,
  },
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
});

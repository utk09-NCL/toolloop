import type { Category, Prisma } from "@prisma/client";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { ToolCard } from "@/components/ToolCard";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Neighborhood } from "@/lib/constants";
import { CATEGORY_LABELS, NEIGHBORHOODS, ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import styles from "./browse.module.css";

export const metadata: Metadata = { title: "Browse tools - ToolLoop" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const VALID_CATEGORIES = new Set(Object.keys(CATEGORY_LABELS));

/** Builds a Prisma ToolWhereInput from URL search params. */
function buildWhere(sp: Awaited<SearchParams>): Prisma.ToolWhereInput {
  const where: Prisma.ToolWhereInput = {};

  const category = typeof sp.category === "string" ? sp.category : undefined;
  if (category && VALID_CATEGORIES.has(category)) where.category = category as Category;

  const available = typeof sp.available === "string" ? sp.available : undefined;
  if (available === "true") where.available = true;
  else if (available === "false") where.available = false;

  const neighborhood = typeof sp.neighborhood === "string" ? sp.neighborhood : undefined;
  if (neighborhood && (NEIGHBORHOODS as readonly string[]).includes(neighborhood)) {
    where.neighborhood = neighborhood as Neighborhood;
  }

  const q = typeof sp.q === "string" ? sp.q.trim() : undefined;
  if (q) where.name = { contains: q };

  return where;
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const where = buildWhere(sp);

  const [tools, currentUser] = await Promise.all([
    db.tool.findMany({ where, include: { owner: true }, orderBy: { createdAt: "desc" } }),
    getCurrentUser(),
  ]);

  const favs = await db.favorite.findMany({
    where: { userId: currentUser.id },
    select: { toolId: true },
  });
  const favSet = new Set(favs.map((f) => f.toolId));

  const hasFilters = !!(sp.category || sp.available || sp.neighborhood || sp.q);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Browse tools</h1>
          {tools.length > 0 && (
            <p className={styles.count}>
              {tools.length} {tools.length === 1 ? "tool" : "tools"}
              {hasFilters ? " found" : " available"}
            </p>
          )}
        </div>
        <Button
          as={TrackedLink}
          href={ROUTES.TOOL_NEW}
          variant="secondary"
          size="sm"
          label="List a tool"
          location="browse"
        >
          List a tool
        </Button>
      </div>

      <Suspense fallback={<div className={styles.filterSkeleton} aria-hidden="true" />}>
        <FilterBar />
      </Suspense>

      {tools.length === 0 ? (
        <EmptyState
          icon={hasFilters ? "🔍" : "🔧"}
          headline={hasFilters ? "No tools match your filters" : "No tools yet"}
          subtext={
            hasFilters
              ? "Try adjusting or clearing your filters."
              : "Be the first to list a tool in your neighborhood."
          }
          action={
            hasFilters ? (
              <Button as={TrackedLink} href={ROUTES.BROWSE} label="Clear filters" location="browse">
                Clear filters
              </Button>
            ) : (
              <Button as={TrackedLink} href={ROUTES.TOOL_NEW} label="List a tool" location="browse">
                List a tool
              </Button>
            )
          }
        />
      ) : (
        <div className={styles.grid}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} isFavorited={favSet.has(tool.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

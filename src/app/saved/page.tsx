import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import styles from "./saved.module.css";

export const metadata: Metadata = { title: "Saved tools - ToolLoop" };

export default async function SavedPage() {
  const currentUser = await getCurrentUser();
  const favorites = await db.favorite.findMany({
    where: { userId: currentUser.id },
    include: { tool: { include: { owner: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Saved tools</h1>
          {favorites.length > 0 && (
            <p className={styles.count}>
              {favorites.length} {favorites.length === 1 ? "tool" : "tools"}
            </p>
          )}
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon="♡"
          headline="No saved tools yet"
          subtext="Tap the heart on any tool to save it here."
          action={
            <Button as={TrackedLink} href={ROUTES.BROWSE} label="Browse tools" location="saved">
              Browse tools
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {favorites.map(({ tool }) => (
            <ToolCard key={tool.id} tool={tool} isFavorited={true} />
          ))}
        </div>
      )}
    </div>
  );
}

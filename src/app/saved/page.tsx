import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Saved tools - ToolLoop" };

// TODO [PRISMA]: Load the current user's favorited tools.
//
//   const me = await getCurrentUser();
//   const favorites = await db.favorite.findMany({
//     where: { userId: me.id },
//     include: { tool: { include: { owner: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//
// The Favorite model has a @@unique([userId, toolId]) constraint - this is what makes the
// heart-toggle idempotent. Clicking the heart calls toggleFavorite(toolId) which checks
// whether a Favorite row exists and creates or deletes it accordingly.
//
// Render a grid of <ToolCard> with isFavorited={true} (all cards here are favorited).
// Empty state when the user hasn't saved anything yet.

export default function SavedPage() {
  return (
    <EmptyState
      icon="♡"
      headline="No saved tools yet"
      subtext="Tap the heart on any tool to save it here. Your saved tools will appear once the database is set up."
      action={
        <Button as={TrackedLink} href={ROUTES.BROWSE}>
          Browse tools
        </Button>
      }
    />
  );
}

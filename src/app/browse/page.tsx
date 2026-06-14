import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Browse tools - ToolLoop" };

// TODO [PRISMA]: Read search params from the URL (?category=POWER_TOOLS&available=true&q=drill)
// and pass them as WHERE filters into db.tool.findMany().
//
// Rough shape of the query:
//   const tools = await db.tool.findMany({
//     where: { category, available, neighborhood, name: { contains: q } },
//     include: { owner: true },      <- need owner.name + owner.avatarColor for ToolCard
//     orderBy: { createdAt: "desc" },
//   });
//
// Also fetch the current user's saved tools so ToolCard can show the filled heart:
//   const me = await getCurrentUser();
//   const favs = await db.favorite.findMany({ where: { userId: me.id }, select: { toolId: true } });
//   const favSet = new Set(favs.map(f => f.toolId));
//
// Then render a grid of <ToolCard> components (one per tool) with isFavorited={favSet.has(tool.id)}.
// If no tools match the filters, show EmptyState with a "Clear filters" button.

export default function BrowsePage() {
  return (
    <EmptyState
      icon="🔧"
      headline="No tools listed yet"
      subtext="Once the database is set up, tools from your neighborhood will appear here. You'll be able to filter by category, availability, and more."
      action={
        <Button as={TrackedLink} href={ROUTES.LIST_NEW_TOOL}>
          List a tool
        </Button>
      }
    />
  );
}

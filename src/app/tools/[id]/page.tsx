import type { Metadata } from "next";
import { notFound } from "next/navigation";

// TODO [PRISMA]: Generate dynamic metadata from the tool name.
//   export async function generateMetadata({ params }) {
//     const { id } = await params;
//     const tool = await db.tool.findUnique({ where: { id }, select: { name: true } });
//     return { title: tool ? `${tool.name} - ToolLoop` : "Tool not found - ToolLoop" };
//   }
export const metadata: Metadata = { title: "Tool detail - ToolLoop" };

// TODO [PRISMA]: Load the tool with its owner, then decide what controls to show.
//
//   const { id } = await params;
//   const [tool, me] = await Promise.all([
//     db.tool.findUnique({ where: { id }, include: { owner: true } }),
//     getCurrentUser(),
//   ]);
//   if (!tool) notFound();
//
//   const isOwner = me.id === tool.ownerId;
//   const favoriteRecord = await db.favorite.findUnique({
//     where: { userId_toolId: { userId: me.id, toolId: id } },
//   });
//
// Renders: photo placeholder, category/condition/availability badges, owner name,
//   description, borrowing rules.
// If visitor is NOT the owner AND tool is available: show <RequestButton> (useActionState form).
// If visitor IS the owner: show "This is your tool." message.
// FavoriteButton toggles the saved state via toggleFavorite server action.

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params - required in Next.js 16 (params is a Promise in the App Router).
  const { id } = await params;
  console.log({ params });

  // TODO [PRISMA]: Replace notFound() with a real db lookup:
  //   const tool = await db.tool.findUnique({ where: { id }, include: { owner: true } });
  //   if (!tool) notFound();
  //
  // Then render the full detail view: photo, badges, owner name, description, rules,
  // FavoriteButton, and RequestButton (or "This is your tool." if isOwner).
  void id; // id will be used by the db query once prisma is wired
  notFound();
}

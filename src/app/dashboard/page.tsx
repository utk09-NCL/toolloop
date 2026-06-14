import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Dashboard - ToolLoop" };

// TODO [PRISMA]: Resolve who is logged in, then load their tools with incoming requests.
//
// Step 1 - identity:
//   const me = await getCurrentUser();
//   getCurrentUser() reads the "toolloop_user" HTTP-only cookie, looks up the User row,
//   and falls back to the first user alphabetically if the cookie is missing.
//
// Step 2 - tools + requests:
//   const tools = await db.tool.findMany({
//     where: { ownerId: me.id },
//     include: {
//       requests: {
//         include: { requester: { select: { name: true } } },
//         orderBy: { createdAt: "desc" },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
//
// Render one card per tool. Each card shows:
//   - tool name + category badge + availability badge
//   - AvailabilityToggle (calls toggleAvailability server action)
//   - RequestList (approve / reject / OTP generate per request)
// Empty state when the owner has no tools yet.

export default function DashboardPage() {
  return (
    <EmptyState
      icon="📋"
      headline="Dashboard coming soon"
      subtext="Once the database is set up, you'll see your listed tools and incoming borrow requests here."
      action={
        <Button as={TrackedLink} href={ROUTES.LIST_NEW_TOOL}>
          List a tool
        </Button>
      }
    />
  );
}

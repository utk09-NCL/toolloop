import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "List a tool - ToolLoop" };

// TODO [PRISMA]: This page needs a Server Action (createTool) to persist the form submission.
//
// The form collects: name, category (enum), condition (enum), description, neighborhood, rules.
// On submit the action:
//   1. Validates input with Zod (createToolSchema)
//   2. Reads getCurrentUser() to get ownerId
//   3. Calls db.tool.create({ data: { ...parsed, ownerId: me.id } })
//   4. Calls revalidatePath("/browse") and revalidatePath("/dashboard")
//   5. Calls redirect(`/tools/${tool.id}`) to send the user to the new tool's detail page
//
// The form component (NewToolForm) is a "use client" component that uses useActionState()
// to wire the form to the server action and show per-field validation errors inline.
//
// No API route needed - Server Actions handle the POST directly.

export default function NewToolPage() {
  return (
    <EmptyState
      icon="🔧"
      headline="List a tool - coming soon"
      subtext="Once the database is set up you'll be able to fill out a form here to list a tool for your neighbors to borrow."
      action={
        <Button as={TrackedLink} href={ROUTES.BROWSE} variant="secondary">
          Browse existing tools
        </Button>
      }
    />
  );
}

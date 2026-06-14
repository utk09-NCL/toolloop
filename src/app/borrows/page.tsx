import type { Metadata } from "next";
import TrackedLink from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "My borrows - ToolLoop" };

// TODO [PRISMA]: Load the current user's active borrow requests (PENDING + APPROVED only).
//
//   const me = await getCurrentUser();
//   const requests = await db.borrowRequest.findMany({
//     where: {
//       requesterId: me.id,
//       status: { in: ["PENDING", "APPROVED"] },  <- only show active ones; RETURNED/CANCELLED/REJECTED go to history
//     },
//     include: { tool: { include: { owner: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//
// For PENDING requests: show a Cancel button (calls cancelRequest server action, no OTP needed).
// For APPROVED requests: show an OTP input form. The borrower enters the 6-digit code
//   the owner generates on their dashboard. submitReturnOtp() verifies the code and
//   atomically sets status=RETURNED + tool.available=true in one $transaction.
//
// Empty state when no active requests exist.

export default function BorrowsPage() {
  return (
    <EmptyState
      icon="📦"
      headline="No active borrow requests"
      subtext="When you request a tool it will appear here. You'll be able to cancel pending requests or submit the return code for approved ones."
      action={
        <Button as={TrackedLink} href={ROUTES.BROWSE}>
          Browse tools
        </Button>
      }
    />
  );
}

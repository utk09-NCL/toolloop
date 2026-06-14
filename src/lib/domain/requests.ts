import type { BorrowRequest, Tool } from "@prisma/client";

export type Decision = { ok: true } | { ok: false; reason: string };
export type RequestAction = "approve" | "reject" | "return" | "cancel";

/** Returns true if the given user owns the tool. */
export function isOwner(tool: Pick<Tool, "ownerId">, userId: string): boolean {
  return tool.ownerId === userId;
}

/** Decides whether a user may create a borrow request - blocks self-requests and unavailable tools. */
export function canCreateRequest(
  tool: Pick<Tool, "ownerId" | "available">,
  requesterId: string,
): Decision {
  if (isOwner(tool, requesterId)) return { ok: false, reason: "You can't borrow your own tool." };
  if (!tool.available) return { ok: false, reason: "This tool isn't available right now." };
  return { ok: true };
}

const REQUIRED_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
  approve: "PENDING",
  reject: "PENDING",
  return: "APPROVED",
  cancel: "PENDING",
};

/** Decides whether a status transition is valid given the request's current status. */
export function canTransition(req: Pick<BorrowRequest, "status">, action: RequestAction): Decision {
  return req.status === REQUIRED_STATUS[action]
    ? { ok: true }
    : { ok: false, reason: `Can't ${action} a ${req.status.toLowerCase()} request.` };
}

/** Returns the target RequestStatus for a given action. */
export function nextStatus(action: RequestAction): BorrowRequest["status"] {
  return (
    {
      approve: "APPROVED",
      reject: "REJECTED",
      return: "RETURNED",
      cancel: "CANCELLED",
    } as const
  )[action];
}

/** Returns the tool availability value to write after an action, or null if no change is needed. */
export function toolAvailabilityAfter(action: RequestAction): boolean | null {
  if (action === "approve") return false;
  if (action === "return") return true;
  return null; // reject, cancel: availability unchanged
}

/** Decides whether the borrower may cancel their own request - only PENDING requests are cancellable. */
export function canCancelRequest(
  req: Pick<BorrowRequest, "requesterId" | "status">,
  userId: string,
): Decision {
  if (req.requesterId !== userId) return { ok: false, reason: "Not your request." };
  if (req.status !== "PENDING") return { ok: false, reason: "Can only cancel a pending request." };
  return { ok: true };
}

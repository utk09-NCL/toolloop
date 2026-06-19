import type { BorrowRequest, Tool } from "@prisma/client";
import { MAX_PENDING_REQUESTS } from "../constants";

type Decision = { ok: true } | { ok: false; reason: string };
export type RequestAction = "approve" | "reject" | "return" | "cancel";

/** Returns true if the given user owns the tool. */
export function isOwner(tool: Pick<Tool, "ownerId">, userId: string): boolean {
  return tool.ownerId === userId;
}

/** Returns true if the given user made the borrow request. */
export function isRequester(req: Pick<BorrowRequest, "requesterId">, userId: string): boolean {
  return req.requesterId === userId;
}

/** Decides whether a user may create a borrow request - blocks self-requests, unavailable tools, and duplicate PENDING requests. */
export function canCreateRequest(
  tool: Pick<Tool, "ownerId" | "available">,
  requesterId: string,
  existingRequests: Pick<BorrowRequest, "requesterId" | "status">[],
  totalPendingCount: number, 
): Decision {
  if (isOwner(tool, requesterId)) return { ok: false, reason: "You can't borrow your own tool." };
  if (!tool.available) return { ok: false, reason: "This tool isn't available right now." };

  if (existingRequests.some((r) => r.requesterId === requesterId && r.status === "PENDING")) {
    return { ok: false, reason: "You already have a pending request for this tool." };
  }

  
  if (totalPendingCount >= MAX_PENDING_REQUESTS) {
    return {
      ok: false,
      reason: `You can only have ${MAX_PENDING_REQUESTS} pending requests at a time. Cancel one before requesting another.`,
    };
  }

  return { ok: true };
}

const REQUIRED_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
  approve: "PENDING",
  reject: "PENDING",
  return: "APPROVED",
  cancel: "PENDING",
};

const TARGET_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
  approve: "APPROVED",
  reject: "REJECTED",
  return: "RETURNED",
  cancel: "CANCELLED",
};

/** Decides whether a user may perform an action - checks both the required status transition and the user's permission (owner vs requester). */
export function canPerformAction(
  req: Pick<BorrowRequest, "status" | "requesterId">,
  tool: Pick<Tool, "ownerId">,
  userId: string,
  action: RequestAction,
): Decision {
  if (req.status !== REQUIRED_STATUS[action]) {
    return { ok: false, reason: `Can't ${action} a ${req.status.toLowerCase()} request.` };
  }
  if (action === "approve" || action === "reject") {
    if (!isOwner(tool, userId)) return { ok: false, reason: "Not your tool." };
  }
  if (action === "cancel" || action === "return") {
    if (!isRequester(req, userId)) return { ok: false, reason: "Not your request." };
  }
  return { ok: true };
}

/** Returns the target RequestStatus for a given action. */
export function nextStatus(action: RequestAction): BorrowRequest["status"] {
  return TARGET_STATUS[action];
}

/** Returns the tool availability value to write after an action, or null if no change is needed. */
export function toolAvailabilityAfter(action: RequestAction): boolean | null {
  if (action === "approve") return false;
  if (action === "return") return true;
  return null; // reject, cancel: availability unchanged
}

/** Generates a random 6-digit OTP string for tool return verification. */
export function generateOtp(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

/** Returns true if the submitted OTP matches the one stored on the request. */
export function verifyOtp(req: Pick<BorrowRequest, "returnOtp">, inputOtp: string): boolean {
  return !!req.returnOtp && req.returnOtp === inputOtp.trim();
}

/** Returns IDs of all other PENDING requests for the same tool that should be auto-rejected when one is approved. */
export function getRequestsToAutoReject(
  approvedRequestId: string,
  allRequestsForTool: Pick<BorrowRequest, "id" | "status">[],
): string[] {
  return allRequestsForTool
    .filter((r) => r.id !== approvedRequestId && r.status === "PENDING")
    .map((r) => r.id);
}

import type { BorrowRequest, Tool } from "@prisma/client";

export type Decision = { ok: true } | { ok: false; reason: string };
export type RequestAction = "approve" | "reject" | "return" | "cancel";

// Returns true if the user is the owner of the tool, false otherwise
export function isOwner(tool: Pick<Tool, "ownerId">, userId: string): boolean {
  return tool.ownerId === userId;
}

// Decide whether a user may create a borrow request, blocks self-requests and requests for tools that are not available
export function canCreateRequest(
  tool: Pick<Tool, "ownerId" | "available">,
  requesterId: string,
): Decision {
  if (isOwner(tool, requesterId)) {
    return { ok: false, reason: "You cannot borrow your own tool." };
  }
  if (!tool.available) {
    return { ok: false, reason: "This tool is not available for borrowing." };
  }
  return { ok: true };
}

const REQUIRED_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
  approve: "PENDING",
  reject: "PENDING",
  return: "APPROVED",
  cancel: "PENDING",
};

// Decide whether a user may perform an action on a borrow request, blocks actions that are not allowed based on the request's status
export function canTransition(req: Pick<BorrowRequest, "status">, action: RequestAction): Decision {
  return req.status === REQUIRED_STATUS[action]
    ? { ok: true }
    : { ok: false, reason: `Can't ${action} a ${req.status.toLowerCase()} request.` };
}

// Return the target RequestStatus for a given action
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

// Return the tool available after an action, or null if no change is needed
export function toolAvailableAfter(action: RequestAction): boolean | null {
  if (action === "approve") {
    return false;
  }
  if (action === "return" || action === "cancel") {
    return true;
  }
  return null;
}

// Decide whether the borrowe may cancel their request
export function canCancelRequest(
  req: Pick<BorrowRequest, "status" | "requesterId">,
  userId: string,
): Decision {
  if (req.requesterId !== userId) {
    return { ok: false, reason: "You are not the requester of this borrow request." };
  }
  if (req.status !== "PENDING") {
    return { ok: false, reason: "You can only cancel a pending borrow request." };
  }
  return { ok: true };
}

// // Gemini Suggestions on improving the code:

// import type { BorrowRequest, Tool } from "@prisma/client";

// export type Decision = { ok: true } | { ok: false; reason: string };
// export type RequestAction = "approve" | "reject" | "return" | "cancel";

// /**
//  * -------------------------------------------------------------
//  * 1. Helper & Authorization Checks
//  * -------------------------------------------------------------
//  */

// // Returns true if the user is the owner of the tool
// export function isOwner(tool: Pick<Tool, "ownerId">, userId: string): boolean {
//   return tool.ownerId === userId;
// }

// // Returns true if the user is the one who requested the tool
// export function isRequester(req: Pick<BorrowRequest, "requesterId">, userId: string): boolean {
//   return req.requesterId === userId;
// }

// /**
//  * -------------------------------------------------------------
//  * 2. Request Creation Rules
//  * -------------------------------------------------------------
//  */

// export function canCreateRequest(
//   tool: Pick<Tool, "ownerId" | "available">,
//   requesterId: string,
//   existingRequests: Pick<BorrowRequest, "requesterId" | "status">[],
// ): Decision {
//   if (isOwner(tool, requesterId)) {
//     return { ok: false, reason: "You cannot borrow your own tool." };
//   }
//   if (!tool.available) {
//     return { ok: false, reason: "This tool is not available for borrowing." };
//   }

//   // Prevent duplicate pending requests from the same user for this tool
//   const hasPending = existingRequests.some(
//     (req) => req.requesterId === requesterId && req.status === "PENDING",
//   );
//   if (hasPending) {
//     return { ok: false, reason: "You already have a pending request for this tool." };
//   }

//   return { ok: true };
// }

// /**
//  * -------------------------------------------------------------
//  * 3. Lifecycle & State Transition Rules
//  * -------------------------------------------------------------
//  */

// // Define strict status prerequisites for each action
// const REQUIRED_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
//   approve: "PENDING",
//   reject: "PENDING",
//   return: "APPROVED",
//   cancel: "PENDING",
// };

// // Define strict target statuses for each action
// const TARGET_STATUS: Record<RequestAction, BorrowRequest["status"]> = {
//   approve: "APPROVED",
//   reject: "REJECTED",
//   return: "RETURNED",
//   cancel: "CANCELLED",
// };

// /**
//  * Validates both status transition validity AND user permissions.
//  */
// export function canPerformAction(
//   req: Pick<BorrowRequest, "status" | "requesterId">,
//   tool: Pick<Tool, "ownerId">,
//   userId: string,
//   action: RequestAction,
// ): Decision {
//   // 1. Check if the current status allows this action
//   if (req.status !== REQUIRED_STATUS[action]) {
//     return { ok: false, reason: `Can't ${action} a ${req.status.toLowerCase()} request.` };
//   }

//   // 2. Check user permissions depending on the action
//   const userIsOwner = isOwner(tool, userId);
//   const userIsRequester = isRequester(req, userId);

//   if (action === "approve" || action === "reject") {
//     if (!userIsOwner) {
//       return { ok: false, reason: "Only the tool owner can approve or reject requests." };
//     }
//   }

//   if (action === "cancel") {
//     if (!userIsRequester) {
//       return { ok: false, reason: "Only the requester can cancel this request." };
//     }
//   }

//   if (action === "return") {
//     // Both the borrower and owner are typically allowed to coordinate a return
//     if (!userIsOwner && !userIsRequester) {
//       return { ok: false, reason: "You are not authorized to return this tool." };
//     }
//   }

//   return { ok: true };
// }

// export function nextStatus(action: RequestAction): BorrowRequest["status"] {
//   return TARGET_STATUS[action];
// }

// export function toolAvailableAfter(action: RequestAction): boolean | null {
//   if (action === "approve") {
//     return false;
//   }
//   if (action === "return" || action === "cancel") {
//     return true;
//   }
//   return null;
// }

// /**
//  * -------------------------------------------------------------
//  * 4. OTP Generation & Verification
//  * -------------------------------------------------------------
//  */

// /**
//  * Generates a simple 6-digit numeric OTP for verifying handovers/returns.
//  */
// export function generateOtp(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// /**
//  * Validates the OTP submitted by the user during a return.
//  */
// export function verifyOtp(req: Pick<BorrowRequest, "returnOtp">, inputOtp: string): boolean {
//   if (!req.returnOtp) return false;
//   return req.returnOtp.trim() === inputOtp.trim();
// }

// /**
//  * -------------------------------------------------------------
//  * 5. Batch/Collateral Actions
//  * -------------------------------------------------------------
//  */

// /**
//  * Returns a list of request IDs that should be auto-cancelled or auto-rejected
//  * when a specific request is approved, because the tool is no longer available.
//  */
// export function getRequestsToAutoReject(
//   approvedRequestId: string,
//   allRequestsForTool: Pick<BorrowRequest, "id" | "status">[],
// ): string[] {
//   return allRequestsForTool
//     .filter((req) => req.id !== approvedRequestId && req.status === "PENDING")
//     .map((req) => req.id);
// }

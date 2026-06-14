"use server";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import {
  canCancelRequest,
  canCreateRequest,
  canTransition,
  isOwner,
  nextStatus,
  type RequestAction,
  toolAvailabilityAfter,
} from "@/lib/domain/requests";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";
import { createRequestSchema } from "@/lib/validation";

type RequestResult = { ok: true } | { ok: false; error: string };

/** Server action for the request-to-borrow form - enforces domain policy then creates a PENDING request. */
export async function createRequest(
  _prevState: RequestResult | null,
  formData: FormData,
): Promise<RequestResult> {
  const me = await getCurrentUser();
  const parsed = createRequestSchema.safeParse({
    toolId: formData.get("toolId"),
    message: formData.get("message") || undefined,
  });
  if (!parsed.success) {
    logger.warn("action.createRequest - invalid input", { userId: me.id });
    return { ok: false, error: "Invalid request." };
  }

  logger.info("action.createRequest", { userId: me.id, toolId: parsed.data.toolId });

  const tool = await db.tool.findUnique({ where: { id: parsed.data.toolId } });
  if (!tool) {
    logger.warn("action.createRequest - tool not found", { toolId: parsed.data.toolId });
    return { ok: false, error: "Tool not found." };
  }

  const decision = canCreateRequest(tool, me.id);
  if (!decision.ok) {
    logger.warn("action.createRequest - denied", {
      reason: decision.reason,
      userId: me.id,
      toolId: tool.id,
    });
    return { ok: false, error: decision.reason };
  }

  await logger.metric(
    "db.borrowRequest.create",
    () =>
      db.borrowRequest.create({
        data: { toolId: tool.id, requesterId: me.id, message: parsed.data.message },
      }),
    { userId: me.id, toolId: tool.id },
  );

  revalidatePath(ROUTES.TOOL(tool.id));
  revalidatePath(ROUTES.DASHBOARD);
  logger.info("action.createRequest - success", { userId: me.id, toolId: tool.id });
  return { ok: true };
}

/** Shared orchestrator for approve/reject/return - verifies ownership, calls domain policy, writes atomically. */
async function transition(requestId: string, action: RequestAction): Promise<RequestResult> {
  const me = await getCurrentUser();
  logger.info(`action.transition.${action}`, { requestId, userId: me.id });

  const req = await db.borrowRequest.findUnique({
    where: { id: requestId },
    include: { tool: true },
  });
  if (!req) {
    logger.warn(`action.transition.${action} - request not found`, { requestId });
    return { ok: false, error: "Request not found." };
  }
  if (!isOwner(req.tool, me.id)) {
    logger.warn(`action.transition.${action} - not owner`, { requestId, userId: me.id });
    return { ok: false, error: "Not your tool." };
  }

  const decision = canTransition(req, action);
  if (!decision.ok) {
    logger.warn(`action.transition.${action} - denied`, { reason: decision.reason, requestId });
    return { ok: false, error: decision.reason };
  }

  const writes: Prisma.PrismaPromise<unknown>[] = [
    db.borrowRequest.update({ where: { id: req.id }, data: { status: nextStatus(action) } }),
  ];
  const avail = toolAvailabilityAfter(action);
  if (avail !== null) {
    writes.push(db.tool.update({ where: { id: req.toolId }, data: { available: avail } }));
  }

  await logger.metric(`db.transaction.${action}`, () => db.$transaction(writes), {
    requestId,
    action,
    toolId: req.toolId,
  });

  revalidatePath(ROUTES.DASHBOARD);
  revalidatePath(ROUTES.TOOL(req.toolId));
  logger.info(`action.transition.${action} - success`, { requestId, toolId: req.toolId });
  return { ok: true };
}

/** Approves a PENDING request and marks the tool unavailable atomically. */
export const approveRequest = async (id: string) => transition(id, "approve");

/** Rejects a PENDING request - tool availability is unchanged. */
export const rejectRequest = async (id: string) => transition(id, "reject");

/** Borrower cancels their own PENDING request - does not affect tool availability. */
export async function cancelRequest(requestId: string): Promise<RequestResult> {
  const me = await getCurrentUser();
  logger.info("action.cancelRequest", { requestId, userId: me.id });

  const req = await db.borrowRequest.findUnique({ where: { id: requestId } });
  if (!req) return { ok: false, error: "Request not found." };

  const decision = canCancelRequest(req, me.id);
  if (!decision.ok) {
    logger.warn("action.cancelRequest - denied", { reason: decision.reason, requestId });
    return { ok: false, error: decision.reason };
  }

  await logger.metric(
    "db.borrowRequest.cancel",
    () => db.borrowRequest.update({ where: { id: requestId }, data: { status: "CANCELLED" } }),
    { requestId },
  );

  revalidatePath(ROUTES.BORROWS);
  revalidatePath(ROUTES.TOOL(req.toolId));
  revalidatePath(ROUTES.DASHBOARD);
  logger.info("action.cancelRequest - success", { requestId });
  return { ok: true };
}

/** Owner generates a 6-digit OTP for an APPROVED request; overwrites any existing code. */
export async function generateReturnOtp(
  requestId: string,
): Promise<{ ok: true; otp: string } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  logger.info("action.generateReturnOtp", { requestId, userId: me.id });

  const req = await db.borrowRequest.findUnique({
    where: { id: requestId },
    include: { tool: true },
  });
  if (!req) return { ok: false, error: "Request not found." };
  if (!isOwner(req.tool, me.id)) return { ok: false, error: "Not your tool." };
  if (req.status !== "APPROVED") return { ok: false, error: "Request must be approved." };

  const otp = String(Math.floor(100_000 + Math.random() * 900_000));

  await logger.metric(
    "db.borrowRequest.generateOtp",
    () => db.borrowRequest.update({ where: { id: requestId }, data: { returnOtp: otp } }),
    { requestId },
  );

  revalidatePath(ROUTES.DASHBOARD);
  logger.info("action.generateReturnOtp - success", { requestId });
  return { ok: true, otp };
}

/** Borrower submits the OTP; on match marks request RETURNED and tool available in one transaction. */
export async function submitReturnOtp(requestId: string, otp: string): Promise<RequestResult> {
  const me = await getCurrentUser();
  logger.info("action.submitReturnOtp", { requestId, userId: me.id });

  const req = await db.borrowRequest.findUnique({
    where: { id: requestId },
    include: { tool: true },
  });
  if (!req) return { ok: false, error: "Request not found." };
  if (req.requesterId !== me.id) return { ok: false, error: "Not your request." };
  if (req.status !== "APPROVED") return { ok: false, error: "This request is not active." };
  if (!req.returnOtp) {
    return { ok: false, error: "No return code yet - ask the owner to generate one." };
  }
  if (req.returnOtp !== otp) {
    logger.warn("action.submitReturnOtp - wrong otp", { requestId });
    return { ok: false, error: "Incorrect return code. Check with the owner." };
  }

  await logger.metric(
    "db.transaction.return",
    () =>
      db.$transaction([
        db.borrowRequest.update({
          where: { id: req.id },
          data: { status: "RETURNED", returnOtp: null },
        }),
        db.tool.update({ where: { id: req.toolId }, data: { available: true } }),
      ]),
    { requestId, toolId: req.toolId },
  );

  revalidatePath(ROUTES.BORROWS);
  revalidatePath(ROUTES.TOOL(req.toolId));
  revalidatePath(ROUTES.DASHBOARD);
  logger.info("action.submitReturnOtp - success", { requestId, toolId: req.toolId });
  return { ok: true };
}

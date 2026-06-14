"use client";
import type { RequestStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { approveRequest, rejectRequest } from "@/actions/requests";
import { OtpGenerator } from "@/components/OtpGenerator";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";
import styles from "./RequestActions.module.css";

interface Props {
  requestId: string;
  status: RequestStatus;
  returnOtp: string | null;
}

/** Client component with approve / reject buttons for PENDING requests, and OTP generator for APPROVED ones. */
export function RequestActions({ requestId, status, returnOtp }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function call(
    action: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>,
    actionName: string,
  ) {
    logger.info(`user.request.${actionName}`, { requestId });
    setError(null);
    startTransition(async () => {
      const result = await action(requestId);
      if (!result.ok) {
        logger.warn(`user.request.${actionName}.failed`, { requestId, error: result.error });
        setError(result.error);
      } else {
        logger.info(`user.request.${actionName}.success`, { requestId });
      }
    });
  }

  if (status === "REJECTED" || status === "RETURNED" || status === "CANCELLED") return null;

  return (
    <div className={styles.wrap}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.buttons}>
        {status === "PENDING" && (
          <>
            <Button
              size="sm"
              variant="primary"
              disabled={isPending}
              onClick={() => call(approveRequest, "approve")}
            >
              {isPending ? "…" : "Approve"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => call(rejectRequest, "reject")}
            >
              {isPending ? "…" : "Reject"}
            </Button>
          </>
        )}
        {status === "APPROVED" && <OtpGenerator requestId={requestId} existingOtp={returnOtp} />}
      </div>
    </div>
  );
}

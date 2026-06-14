"use client";
import { useState, useTransition } from "react";
import { cancelRequest } from "@/actions/requests";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";
import styles from "./CancelRequestButton.module.css";

interface Props {
  requestId: string;
}

/** Borrower button to cancel a pending borrow request - disappears from the list on success. */
export function CancelRequestButton({ requestId }: Props) {
  const [cancelled, setCancelled] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (cancelled) return null;

  function handle() {
    logger.info("user.request.cancel", { requestId });
    setError(null);
    startTransition(async () => {
      const result = await cancelRequest(requestId);
      if (result.ok) {
        setCancelled(true);
      } else {
        logger.warn("user.request.cancel.failed", { requestId, error: result.error });
        setError(result.error);
      }
    });
  }

  return (
    <div className={styles.wrap}>
      <Button size="sm" variant="ghost" disabled={pending} onClick={handle}>
        {pending ? "Cancelling…" : "Cancel request"}
      </Button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

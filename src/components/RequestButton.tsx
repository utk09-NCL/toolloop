"use client";
import { useActionState, useEffect } from "react";
import { createRequest } from "@/actions/requests";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";
import styles from "./RequestButton.module.css";

interface Props {
  toolId: string;
}

export function RequestButton({ toolId }: Props) {
  const [state, formAction, isPending] = useActionState(createRequest, null);

  useEffect(() => {
    if (state?.ok === true) {
      logger.info("user.request.submit.success", { toolId });
    } else if (state?.ok === false) {
      logger.warn("user.request.submit.failed", { toolId, error: state.error });
    }
  }, [state, toolId]);

  if (state?.ok) {
    return (
      <p className={styles.success} role="status">
        Request sent. Waiting on the owner to approve.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className={styles.form}
      onSubmit={() => logger.info("user.request.submit", { toolId })}
    >
      <input type="hidden" name="toolId" value={toolId} />
      <div className={styles.field}>
        <label htmlFor="req-message" className={styles.label}>
          Message <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="req-message"
          name="message"
          className={styles.textarea}
          placeholder="When can you pick up? Any questions?"
          rows={2}
          maxLength={300}
        />
      </div>
      {state?.ok === false && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Request to borrow"}
      </Button>
    </form>
  );
}

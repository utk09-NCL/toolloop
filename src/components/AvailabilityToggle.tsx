"use client";
import { useState, useTransition } from "react";
import { toggleAvailability } from "@/actions/tools";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";
import styles from "./AvailabilityToggle.module.css";

interface Props {
  toolId: string;
  available: boolean;
}

/** Client button that flips a tool's availability flag via the toggleAvailability server action. */
export function AvailabilityToggle({ toolId, available }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle() {
    logger.info("user.availability.toggle", { toolId, currentlyAvailable: available });
    setError(null);
    startTransition(async () => {
      const res = await toggleAvailability(toolId);
      if (!res.ok) {
        logger.warn("user.availability.toggle.failed", { toolId, error: res.error });
        setError(res.error);
      } else {
        logger.info("user.availability.toggle.success", { toolId, newAvailable: !available });
      }
    });
  }

  return (
    <div className={styles.wrap}>
      <Button size="sm" variant="ghost" disabled={isPending} onClick={handle}>
        {isPending ? "Saving…" : available ? "Mark unavailable" : "Mark available"}
      </Button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

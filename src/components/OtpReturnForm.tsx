"use client";
import { useState, useTransition } from "react";
import { submitReturnOtp } from "@/actions/requests";
import { logger } from "@/lib/logger";
import styles from "./OtpReturnForm.module.css";

interface Props {
  requestId: string;
}

/** Borrower form to enter a 6-digit return OTP and confirm the tool has been handed back. */
export function OtpReturnForm({ requestId }: Props) {
  const [otp, setOtp] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <p className={styles.success} role="status">
        Returned - thank you!
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit code from the owner.");
      return;
    }
    logger.info("user.otp.submit", { requestId });
    setError(null);
    startTransition(async () => {
      const result = await submitReturnOtp(requestId, otp.trim());
      if (result.ok) {
        setDone(true);
      } else {
        logger.warn("user.otp.submit.failed", { requestId, error: result.error });
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          className={styles.input}
          placeholder="000000"
          aria-label="6-digit return code"
          aria-describedby={error ? "otp-error" : undefined}
          aria-invalid={!!error}
        />
        <button type="submit" className={styles.submitBtn} disabled={pending || otp.length !== 6}>
          {pending ? "Checking…" : "Confirm return"}
        </button>
      </div>
      {error && (
        <p id="otp-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

"use client";
import { useState, useTransition } from "react";
import { generateReturnOtp } from "@/actions/requests";
import { logger } from "@/lib/logger";
import styles from "./OtpGenerator.module.css";

interface Props {
  requestId: string;
  existingOtp: string | null;
}

/** Owner's dashboard: generates a 6-digit return OTP, shown as a password field with show/hide toggle. */
export function OtpGenerator({ requestId, existingOtp }: Props) {
  const [otp, setOtp] = useState<string | null>(existingOtp);
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function generate() {
    logger.info("user.otp.generate", { requestId });
    setError(null);
    startTransition(async () => {
      const result = await generateReturnOtp(requestId);
      if (result.ok) {
        setOtp(result.otp);
        setVisible(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (!otp) {
    return (
      <div className={styles.wrap}>
        <button type="button" className={styles.generateBtn} onClick={generate} disabled={pending}>
          {pending ? "Generating…" : "Generate return code"}
        </button>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Return code</p>
      <div className={styles.otpRow}>
        <input
          type={visible ? "text" : "password"}
          readOnly
          value={otp}
          className={styles.otpInput}
          aria-label="Return OTP code"
        />
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide return code" : "Show return code"}
        >
          {visible ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          className={styles.regenerateBtn}
          onClick={generate}
          disabled={pending}
          aria-label="Regenerate return code"
        >
          {pending ? "…" : "Regenerate"}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

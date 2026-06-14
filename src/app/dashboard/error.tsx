"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // This satisfies the linter by "using" the error (and is good practice!)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Something went wrong!</h2>
      <p>We encountered an unexpected issue while trying to load this section.</p>
      {/* Added type="button" here */}
      <button type="button" className={styles.button} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

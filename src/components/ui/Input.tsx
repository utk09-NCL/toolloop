import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {hint && <span className={styles.hint}>{hint}</span>}
      <input
        id={inputId}
        className={[styles.input, error ? styles.inputError : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

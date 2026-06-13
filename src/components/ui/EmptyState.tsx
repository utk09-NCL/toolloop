import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  icon?: string;
  headline: string;
  subtext?: string;
  action?: ReactNode;
};

export function EmptyState({ icon = "📭", headline, subtext, action }: EmptyStateProps) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <h2 className={styles.headline}>{headline}</h2>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

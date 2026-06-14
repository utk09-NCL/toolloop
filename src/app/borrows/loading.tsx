import styles from "./borrows.module.css";

export default function BorrowsLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div
          style={{
            height: "1.75rem",
            width: "9rem",
            background: "var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
          aria-hidden="true"
        />
      </div>
      <div className={styles.list}>
        {Array.from({ length: 3 }, (_, i) => i).map((n) => (
          <div
            key={n}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                height: "1.25rem",
                width: "60%",
                background: "var(--color-border)",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: "0.875rem",
                width: "40%",
                background: "var(--color-border)",
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

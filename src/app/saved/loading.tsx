import styles from "./saved.module.css";

export default function SavedLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div
          style={{
            height: "1.75rem",
            width: "8rem",
            background: "var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
          aria-hidden="true"
        />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 4 }, (_, i) => i).map((n) => (
          <div
            key={n}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "var(--space-4)",
              display: "flex",
              gap: "var(--space-3)",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius-sm)",
                background: "var(--color-border)",
                flexShrink: 0,
              }}
            />
            <div
              style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
            >
              <div
                style={{
                  height: "1rem",
                  width: "60%",
                  background: "var(--color-border)",
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  height: "1.25rem",
                  width: "80%",
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
          </div>
        ))}
      </div>
    </div>
  );
}

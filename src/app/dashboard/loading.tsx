import styles from "./dashboard.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div
              style={{
                height: "1.75rem",
                width: "9rem",
                background: "var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
              aria-hidden="true"
            />
            <div
              style={{
                height: "1rem",
                width: "12rem",
                background: "var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
        <ul className={styles.toolList} aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => i).map((n) => (
            <SkeletonTool key={n} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkeletonTool() {
  return (
    <li
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "var(--space-4)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-sm)",
            background: "var(--color-border)",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div
            style={{
              height: "1rem",
              width: "40%",
              background: "var(--color-border)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: "0.875rem",
              width: "25%",
              background: "var(--color-border)",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <div
          style={{
            height: "0.75rem",
            width: "5rem",
            background: "var(--color-border)",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: "2.5rem",
            background: "var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        />
      </div>
    </li>
  );
}

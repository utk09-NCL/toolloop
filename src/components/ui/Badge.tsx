import styles from "./Badge.module.css";

type BadgeVariant =
  | "category"
  | "condition"
  | "available"
  | "unavailable"
  | "pending"
  | "approved"
  | "rejected"
  | "returned";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

export function Badge({ label, variant = "category" }: BadgeProps) {
  return <span className={[styles.badge, styles[variant]].join(" ")}>{label}</span>;
}

import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

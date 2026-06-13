import type { ComponentPropsWithoutRef, ElementType } from "react";
import styles from "./Button.module.css";

type ButtonOwnProps<E extends ElementType = "button"> = {
  as?: E;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
};

type ButtonProps<E extends ElementType = "button"> = ButtonOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

export function Button<E extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps<E>) {
  const Tag = (as ?? "button") as ElementType;
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");

  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}

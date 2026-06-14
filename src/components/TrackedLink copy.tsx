"use client";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { logger } from "@/lib/logger";

type Props = ComponentPropsWithoutRef<typeof Link> & {
  label?: string;
  location?: string;
};

/** Drop-in Next.js Link replacement that logs a user.link.click event on every navigation. */
export function TrackedLink({ label, location, onClick, children, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        logger.info("user.link.click", {
          href: String(props.href),
          ...(label && { label }),
          ...(location && { location }),
        });
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}

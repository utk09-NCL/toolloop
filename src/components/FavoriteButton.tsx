"use client";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/actions/favorites";
import { logger } from "@/lib/logger";
import styles from "./FavoriteButton.module.css";

type Props = {
  toolId: string;
  isFavorited: boolean;
};

export function FavoriteButton({ toolId, isFavorited }: Props) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const next = !favorited;
    logger.info("user.favorite.toggle", { toolId, favorited: next });
    setFavorited(next);
    startTransition(async () => {
      const result = await toggleFavorite(toolId);
      setFavorited(result.favorited);
    });
  }

  return (
    <button
      type="button"
      className={[styles.btn, favorited ? styles.favorited : ""].join(" ").trim()}
      onClick={handleClick}
      aria-label={favorited ? "Remove from saved" : "Save tool"}
      aria-pressed={favorited}
      disabled={pending}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

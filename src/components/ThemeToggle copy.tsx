"use client";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Navbar button that toggles between light and dark mode, persisting preference in localStorage. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = resolveTheme();
    document.documentElement.dataset.theme = t;
    setTheme(t);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    logger.info("user.theme.toggle", { theme: next });
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
          <line x1="8" y1="1" x2="8" y2="3" />
          <line x1="8" y1="13" x2="8" y2="15" />
          <line x1="1" y1="8" x2="3" y2="8" />
          <line x1="13" y1="8" x2="15" y2="8" />
          <line x1="2.9" y1="2.9" x2="4.3" y2="4.3" />
          <line x1="11.7" y1="11.7" x2="13.1" y2="13.1" />
          <line x1="13.1" y1="2.9" x2="11.7" y2="4.3" />
          <line x1="4.3" y1="11.7" x2="2.9" y2="13.1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6.002 6.002 0 1 0 8 8z" />
        </svg>
      )}
    </button>
  );
}

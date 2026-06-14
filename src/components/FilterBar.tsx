"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORY_LABELS, NEIGHBORHOODS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import styles from "./FilterBar.module.css";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/** Client filter bar - writes category / availability / neighborhood / search to URL query params. */
export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function update(key: string, value: string) {
    logger.info("user.filter.change", { filter: key, value: value || "all" });
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`${pathname}?${p.toString()}`);
  }

  const hasFilters = searchParams.size > 0;

  return (
    <search className={styles.bar} aria-label="Filter tools">
      <select
        className={styles.select}
        value={searchParams.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={searchParams.get("available") ?? ""}
        onChange={(e) => update("available", e.target.value)}
        aria-label="Filter by availability"
      >
        <option value="">All availability</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>

      <select
        className={styles.select}
        value={searchParams.get("neighborhood") ?? ""}
        onChange={(e) => update("neighborhood", e.target.value)}
        aria-label="Filter by neighborhood"
      >
        <option value="">All neighborhoods</option>
        {NEIGHBORHOODS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <form
        className={styles.searchForm}
        onSubmit={(e) => {
          e.preventDefault();
          logger.info("user.filter.search", { query: query.trim() });
          update("q", query.trim());
        }}
        aria-label="Search by name"
      >
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search tools…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tools by name"
        />
      </form>

      {hasFilters && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            logger.info("user.filter.clear");
            router.push(pathname);
          }}
        >
          Clear
        </button>
      )}
    </search>
  );
}

import { TrackedLink } from "@/components/TrackedLink";
import { ROUTES } from "@/lib/constants";
import styles from "./Footer.module.css";

/** Site-wide footer with nav links and community tagline. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoMark} aria-hidden="true">
            ⬡
          </span>
          <span className={styles.logoText}>ToolLoop</span>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <TrackedLink
            href={ROUTES.BROWSE}
            className={styles.link}
            label="Browse"
            location="footer"
          >
            Browse
          </TrackedLink>
          <TrackedLink
            href={ROUTES.TOOL_NEW}
            className={styles.link}
            label="List a tool"
            location="footer"
          >
            List a tool
          </TrackedLink>
          <TrackedLink
            href={ROUTES.DASHBOARD}
            className={styles.link}
            label="Dashboard"
            location="footer"
          >
            Dashboard
          </TrackedLink>
          <TrackedLink href="/llms.txt" className={styles.link} label="llms.txt" location="footer">
            llms.txt
          </TrackedLink>
        </nav>
        <p className={styles.note}>Community tool lending · No money changes hands.</p>
      </div>
    </footer>
  );
}

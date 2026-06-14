import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Community tool lending</p>
          <h1 id="hero-heading" className={styles.headline}>
            Borrow tools from
            <br />
            people nearby.
          </h1>
          <p className={styles.subline}>
            Your neighbor has the drill. You have the ladder. ToolLoop connects the two of you - no
            cost, no fuss, just a community sharing what it already owns.
          </p>
          <div className={styles.actions}>
            <Button
              as={TrackedLink}
              href={ROUTES.BROWSE}
              size="lg"
              label="Browse tools"
              location="home"
            >
              Browse tools
            </Button>
            <TrackedLink
              href={ROUTES.TOOL_NEW}
              className={styles.secondaryLink}
              label="List a tool you own"
              location="home"
            >
              List a tool you own →
            </TrackedLink>
          </div>
        </div>
        <div className={styles.heroIllustration} aria-hidden="true">
          <div className={styles.toolGrid}>
            {TOOL_ICONS.map((icon) => (
              <span key={icon} className={styles.toolIcon}>
                {icon}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.howItWorks} aria-labelledby="how-heading">
        <div className={styles.inner}>
          <h2 id="how-heading" className={styles.sectionTitle}>
            How it works
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((step) => (
              <li key={step.n} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {step.n}
                </span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

const TOOL_ICONS = ["🔧", "🪚", "🔨", "🪜", "🌿", "🚿", "🔩", "🪛"];

const STEPS = [
  {
    n: "1",
    title: "Browse what's nearby",
    desc: "See tools your neighbors are willing to lend. Filter by category, neighborhood, or availability.",
  },
  {
    n: "2",
    title: "Request to borrow",
    desc: "Send a quick message. The owner gets a notification and can approve or decline.",
  },
  {
    n: "3",
    title: "Pick it up and return it",
    desc: "Coordinate with the owner directly. When you're done, mark it returned and it's available again.",
  },
];

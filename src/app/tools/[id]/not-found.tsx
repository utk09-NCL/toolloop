import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";
import styles from "./not-found.module.css";

export default function ToolNotFound() {
  return (
    <div className={styles.wrap}>
      <EmptyState
        icon="🔍"
        headline="Tool not found"
        subtext="This tool may have been removed or the link is incorrect."
        action={
          <Button as={TrackedLink} href={ROUTES.BROWSE} label="Browse tools" location="not-found">
            Browse tools
          </Button>
        }
      />
    </div>
  );
}

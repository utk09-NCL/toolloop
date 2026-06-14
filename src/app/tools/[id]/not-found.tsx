import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ToolNotFound() {
  return (
    <div
      style={{
        maxWidth: "var(--content-max)",
        margin: "0 auto",
        padding: "var(--space-8) var(--space-4)",
      }}
    >
      <EmptyState
        icon="🔍"
        headline="Tool not found"
        subtext="This tool may have been removed or the link is incorrect."
        action={
          <Button as={Link} href="/browse">
            Browse tools
          </Button>
        }
      />
    </div>
  );
}

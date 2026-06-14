import Link from "next/link";
import { AvailabilityToggle } from "@/components/AvailabilityToggle";
import { RequestList } from "@/components/RequestList";
import { ToolPhoto } from "@/components/ToolPhoto";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORY_LABELS } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import styles from "./dashboard.module.css";

export const metadata = { title: "Dashboard - ToolLoop" };

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  const tools = await db.tool.findMany({
    where: { ownerId: currentUser.id },
    include: {
      requests: {
        include: { requester: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Viewing as {currentUser.name}</p>
          </div>
          <Button as={Link} href="/tools/new" size="sm">
            + List a tool
          </Button>
        </div>

        {tools.length === 0 ? (
          <EmptyState
            icon="🔧"
            headline="No tools listed yet"
            subtext="List a tool to start lending to neighbors."
            action={
              <Button as={Link} href="/tools/new">
                List your first tool
              </Button>
            }
          />
        ) : (
          <ul className={styles.toolList}>
            {tools.map((tool) => (
              <li key={tool.id} className={styles.toolItem}>
                <div className={styles.toolHeader}>
                  <div className={styles.toolLeft}>
                    <ToolPhoto
                      toolName={tool.name}
                      avatarColor={currentUser.avatarColor}
                      size="sm"
                    />
                    <div className={styles.toolMeta}>
                      <Link href={`/tools/${tool.id}`} className={styles.toolName}>
                        {tool.name}
                      </Link>
                      <div className={styles.toolBadges}>
                        <Badge label={CATEGORY_LABELS[tool.category]} variant="category" />
                        <Badge
                          label={tool.available ? "Available" : "Unavailable"}
                          variant={tool.available ? "available" : "unavailable"}
                        />
                      </div>
                    </div>
                  </div>
                  <AvailabilityToggle toolId={tool.id} available={tool.available} />
                </div>

                <div className={styles.requestsSection}>
                  <h3 className={styles.requestsHeading}>
                    Requests
                    {tool.requests.length > 0 && (
                      <span className={styles.requestCount}>{tool.requests.length}</span>
                    )}
                  </h3>
                  <RequestList requests={tool.requests} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

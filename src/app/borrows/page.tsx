import type { Metadata } from "next";
import { CancelRequestButton } from "@/components/CancelRequestButton";
import { OtpReturnForm } from "@/components/OtpReturnForm";
import { TrackedLink } from "@/components/TrackedLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES, STATUS_LABELS } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import styles from "./borrows.module.css";

export const metadata: Metadata = { title: "My borrows - ToolLoop" };

export default async function BorrowsPage() {
  const currentUser = await getCurrentUser();

  const requests = await db.borrowRequest.findMany({
    where: {
      requesterId: currentUser.id,
      status: { in: ["PENDING", "APPROVED"] },
    },
    include: { tool: { include: { owner: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My borrows</h1>
          {requests.length > 0 && (
            <p className={styles.count}>
              {requests.length} active {requests.length === 1 ? "request" : "requests"}
            </p>
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon="🔧"
          headline="No active borrow requests"
          subtext="When you request a tool, it'll show up here."
          action={
            <Button as={TrackedLink} href={ROUTES.BROWSE} label="Browse tools" location="borrows">
              Browse tools
            </Button>
          }
        />
      ) : (
        <ul className={styles.list}>
          {requests.map((req) => (
            <li key={req.id} className={styles.item}>
              <div className={styles.toolInfo}>
                <TrackedLink
                  href={ROUTES.TOOL(req.tool.id)}
                  className={styles.toolName}
                  label={req.tool.name}
                  location="borrows"
                >
                  {req.tool.name}
                </TrackedLink>
                <p className={styles.owner}>
                  {req.tool.owner.name} · {req.tool.neighborhood}
                </p>
                {req.message && <p className={styles.message}>"{req.message}"</p>}
              </div>

              <div className={styles.actions}>
                <Badge
                  label={STATUS_LABELS[req.status]}
                  variant={req.status === "PENDING" ? "pending" : "approved"}
                />

                {req.status === "PENDING" && <CancelRequestButton requestId={req.id} />}

                {req.status === "APPROVED" && (
                  <div className={styles.returnSection}>
                    <p className={styles.returnHint}>
                      Ask the owner for their 6-digit return code.
                    </p>
                    <OtpReturnForm requestId={req.id} />
                    <p className={styles.support}>
                      Problem?{" "}
                      <a href="mailto:support@toolloop.example" className={styles.supportLink}>
                        support@toolloop.example
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

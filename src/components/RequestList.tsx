import type { RequestStatus } from "@prisma/client";
import { RequestActions } from "@/components/RequestActions";
import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import styles from "./RequestList.module.css";

type RequestRow = {
  id: string;
  status: RequestStatus;
  message: string | null;
  returnOtp: string | null;
  createdAt: Date;
  requester: { name: string };
};

interface Props {
  requests: RequestRow[];
}

function statusVariant(s: RequestStatus): "pending" | "approved" | "rejected" | "returned" {
  switch (s) {
    case "PENDING":
      return "pending";
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "RETURNED":
      return "returned";
    case "CANCELLED":
      return "rejected"; // reuse rejected (muted stone) styling for cancelled
  }
}

/** Server component that renders a list of borrow requests with inline action buttons. */
export function RequestList({ requests }: Props) {
  if (requests.length === 0) {
    return <p className={styles.empty}>No requests yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {requests.map((req) => (
        <li key={req.id} className={styles.item}>
          <div className={styles.info}>
            <div className={styles.topRow}>
              <span className={styles.name}>{req.requester.name}</span>
              <Badge label={STATUS_LABELS[req.status]} variant={statusVariant(req.status)} />
            </div>
            {req.message && <p className={styles.message}>{req.message}</p>}
            <time className={styles.date} dateTime={req.createdAt.toISOString()}>
              {req.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <RequestActions requestId={req.id} status={req.status} returnOtp={req.returnOtp} />
        </li>
      ))}
    </ul>
  );
}

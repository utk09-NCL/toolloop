import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";
import { NewToolForm } from "./NewToolForm";
import styles from "./new.module.css";

export const metadata: Metadata = { title: "List a tool - ToolLoop" };

export default async function NewToolPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>List a tool</h1>
          <p className={styles.subtitle}>
            Share something you own. Neighbors can request to borrow it - no money involved.
          </p>
        </header>
        <NewToolForm defaultNeighborhood={currentUser.neighborhood} />
      </div>
    </div>
  );
}

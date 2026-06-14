"use client";
import { useTransition } from "react";
import { setCurrentUser } from "@/actions/session";
import { logger } from "@/lib/logger";
import styles from "./UserSwitcher.module.css";

type UserOption = { id: string; name: string; avatarColor: string };

type UserSwitcherProps = {
  users: UserOption[];
  currentUserId: string;
};

export function UserSwitcher({ users, currentUserId }: UserSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={styles.wrapper}>
      <label htmlFor="user-switcher" className={styles.label}>
        Demo user
      </label>
      <select
        id="user-switcher"
        className={styles.select}
        value={currentUserId}
        disabled={isPending}
        onChange={(e) => {
          const toUserId = e.target.value;
          logger.info("user.switchUser", { fromUserId: currentUserId, toUserId });
          startTransition(() => {
            setCurrentUser(toUserId);
          });
        }}
        aria-label="Switch demo user"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}

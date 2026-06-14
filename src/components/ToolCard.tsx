import type { Tool, User } from "@prisma/client";
import { FavoriteButton } from "@/components/FavoriteButton";
import { TrackedLink } from "@/components/TrackedLink";
import { CATEGORY_LABELS, ROUTES } from "@/lib/constants";
import styles from "./ToolCard.module.css";
import { ToolPhoto } from "./ToolPhoto";
import { Badge } from "./ui/Badge";

type ToolWithOwner = Tool & { owner: Pick<User, "name" | "avatarColor"> };

type ToolCardProps = {
  tool: ToolWithOwner;
  isFavorited: boolean;
};

export function ToolCard({ tool, isFavorited }: ToolCardProps) {
  return (
    <article className={styles.card}>
      <TrackedLink
        href={ROUTES.TOOL(tool.id)}
        className={styles.cardLink}
        label={tool.name}
        location="card"
      >
        <span className={styles.srOnly}>View {tool.name}</span>
      </TrackedLink>

      <div className={styles.photoArea}>
        <ToolPhoto toolName={tool.name} avatarColor={tool.owner.avatarColor} size="lg" />
        <div className={styles.favoriteSlot}>
          <FavoriteButton toolId={tool.id} isFavorited={isFavorited} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.badges}>
          <Badge label={CATEGORY_LABELS[tool.category]} variant="category" />
          <Badge
            label={tool.available ? "Available" : "Unavailable"}
            variant={tool.available ? "available" : "unavailable"}
          />
        </div>
        <h2 className={styles.name}>{tool.name}</h2>
        <p className={styles.neighborhood}>{tool.neighborhood}</p>
      </div>
    </article>
  );
}

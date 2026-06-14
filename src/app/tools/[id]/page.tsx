import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RequestButton } from "@/components/RequestButton";
import { ToolPhoto } from "@/components/ToolPhoto";
import { TrackedLink } from "@/components/TrackedLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CATEGORY_LABELS, CONDITION_LABELS, ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import styles from "./detail.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tool = await db.tool.findUnique({ where: { id }, select: { name: true } });
  return { title: tool ? `${tool.name} - ToolLoop` : "Tool not found - ToolLoop" };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [tool, currentUser] = await Promise.all([
    db.tool.findUnique({ where: { id }, include: { owner: true } }),
    getCurrentUser(),
  ]);

  if (!tool) notFound();

  const isOwner = currentUser.id === tool.ownerId;

  const favoriteRecord = await db.favorite.findUnique({
    where: { userId_toolId: { userId: currentUser.id, toolId: id } },
  });
  const isFavorited = !!favoriteRecord;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <nav aria-label="Breadcrumb">
          <TrackedLink
            href={ROUTES.BROWSE}
            className={styles.backLink}
            label="Back to browse"
            location="detail"
          >
            ← Back to browse
          </TrackedLink>
        </nav>

        <div className={styles.layout}>
          <div className={styles.photoCol}>
            <ToolPhoto toolName={tool.name} avatarColor={tool.owner.avatarColor} size="lg" />
          </div>

          <div className={styles.infoCol}>
            <div className={styles.badges}>
              <Badge label={CATEGORY_LABELS[tool.category]} variant="category" />
              <Badge label={CONDITION_LABELS[tool.condition]} variant="condition" />
              <Badge
                label={tool.available ? "Available" : "Unavailable"}
                variant={tool.available ? "available" : "unavailable"}
              />
            </div>

            <div className={styles.nameRow}>
              <h1 className={styles.name}>{tool.name}</h1>
              <FavoriteButton toolId={tool.id} isFavorited={isFavorited} />
            </div>

            <p className={styles.listedBy}>
              Listed by <strong>{tool.owner.name}</strong> · {tool.neighborhood}
            </p>

            <p className={styles.description}>{tool.description}</p>

            {tool.rules && (
              <div className={styles.rules}>
                <h2 className={styles.rulesTitle}>Rules for borrowing</h2>
                <p className={styles.rulesText}>{tool.rules}</p>
              </div>
            )}

            <div className={styles.requestArea}>
              {isOwner ? (
                <p className={styles.ownerNote}>This is your tool.</p>
              ) : !tool.available ? (
                <Button disabled aria-disabled="true">
                  Currently unavailable
                </Button>
              ) : (
                <RequestButton toolId={tool.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

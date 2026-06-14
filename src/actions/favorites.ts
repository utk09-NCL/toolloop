"use server";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";

/** Toggles the current user's saved/unsaved state for a tool - idempotent via DB @@unique constraint. */
export async function toggleFavorite(toolId: string): Promise<{ ok: true; favorited: boolean }> {
  const me = await getCurrentUser();
  logger.info("action.toggleFavorite", { toolId, userId: me.id });

  const existing = await db.favorite.findUnique({
    where: { userId_toolId: { userId: me.id, toolId } },
  });

  const action = existing ? "unfavorite" : "favorite";

  await logger.metric(
    "db.favorite.toggle",
    async () => {
      if (existing) {
        await db.favorite.delete({ where: { id: existing.id } });
      } else {
        await db.favorite.create({ data: { userId: me.id, toolId } });
      }
    },
    { toolId, userId: me.id, action },
  );

  revalidatePath(ROUTES.SAVED);
  revalidatePath(ROUTES.TOOL(toolId));
  logger.info("action.toggleFavorite - success", { toolId, userId: me.id, favorited: !existing });
  return { ok: true, favorited: !existing };
}

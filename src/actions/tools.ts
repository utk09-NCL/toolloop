"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getCurrentUser } from "@/lib/session";
import { createToolSchema } from "@/lib/validation";

type ToolFormState = null | { ok: false; errors: Record<string, string> } | { ok: true };

/** Server action for the create-tool form - validates input, persists the tool, then redirects to its detail page. */
export async function createTool(
  _prevState: ToolFormState,
  formData: FormData,
): Promise<ToolFormState> {
  const me = await getCurrentUser();
  logger.info("action.createTool", { userId: me.id });

  const parsed = createToolSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    description: formData.get("description"),
    neighborhood: formData.get("neighborhood"),
    rules: formData.get("rules") || "",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !errors[key]) errors[key] = issue.message;
    }
    logger.warn("action.createTool - validation failed", { userId: me.id, errors });
    return { ok: false, errors };
  }

  const tool = await logger.metric(
    "db.tool.create",
    () => db.tool.create({ data: { ...parsed.data, ownerId: me.id } }),
    { userId: me.id, category: parsed.data.category },
  );

  logger.info("action.createTool - success", { userId: me.id, toolId: tool.id });
  revalidatePath(ROUTES.BROWSE);
  revalidatePath(ROUTES.DASHBOARD);
  redirect(ROUTES.TOOL(tool.id));
}

/** Flips a tool's availability flag - only the tool's owner may call this. */
export async function toggleAvailability(
  toolId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  logger.info("action.toggleAvailability", { toolId, userId: me.id });

  const tool = await db.tool.findUnique({ where: { id: toolId } });
  if (!tool) {
    logger.warn("action.toggleAvailability - tool not found", { toolId });
    return { ok: false, error: "Tool not found." };
  }
  if (tool.ownerId !== me.id) {
    logger.warn("action.toggleAvailability - not owner", { toolId, userId: me.id });
    return { ok: false, error: "Not your tool." };
  }

  await logger.metric(
    "db.tool.update.availability",
    () => db.tool.update({ where: { id: toolId }, data: { available: !tool.available } }),
    { toolId, newAvailable: !tool.available },
  );

  revalidatePath(ROUTES.DASHBOARD);
  revalidatePath(ROUTES.TOOL(toolId));
  logger.info("action.toggleAvailability - success", { toolId, newAvailable: !tool.available });
  return { ok: true };
}

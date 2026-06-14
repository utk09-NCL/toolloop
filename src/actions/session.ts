"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { COOKIE_NAME } from "@/lib/session";

/** Sets the demo current-user cookie and revalidates the entire layout so all pages reflect the switch. */
export async function setCurrentUser(userId: string) {
  logger.info("session.setCurrentUser", { userId });
  (await cookies()).set(COOKIE_NAME, userId, { httpOnly: true, path: "/" });
  revalidatePath("/", "layout");
}

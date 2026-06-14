import { cookies } from "next/headers";
import { db } from "./db";

/** HTTP-only cookie name that stores the demo user id. */
export const COOKIE_NAME = "toolloop_user";

/** Returns the current demo user from the cookie, falling back to the first user alphabetically. */
export async function getCurrentUser() {
  const id = (await cookies()).get(COOKIE_NAME)?.value;
  if (id) {
    const user = await db.user.findUnique({ where: { id } });
    if (user) return user;
  }
  return db.user.findFirstOrThrow({ orderBy: { name: "asc" } });
}

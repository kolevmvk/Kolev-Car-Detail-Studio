import "server-only";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/server";
import { createAdminSupabaseClient } from "@/lib/db/admin";

/** Require authenticated admin session. Redirects to /studio/login if not. */
export async function requireAdmin() {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect("/studio/login");

  const adminDb = createAdminSupabaseClient();
  const { data: studioUser } = await adminDb
    .from("studio_users")
    .select("id, role, status, display_name, email")
    .eq("id", user.id)
    .single();

  if (!studioUser || studioUser.status !== "active") {
    // Auth'd user but not a studio user — sign out and redirect.
    await sb.auth.signOut();
    redirect("/studio/login");
  }

  return { user, studioUser };
}

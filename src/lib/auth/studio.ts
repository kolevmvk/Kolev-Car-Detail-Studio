import "server-only";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/server";

/** Require authenticated admin session. Redirects to /studio/login if not. */
export async function requireAdmin() {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect("/studio/login");

  const { data: adminProfile } = await sb
    .from("admin_profiles")
    .select("user_id, role, status, display_name, created_at, last_login_at")
    .eq("user_id", user.id)
    .single();

  if (!adminProfile || adminProfile.status !== "active") {
    // Auth'd user but not a studio user — sign out and redirect.
    await sb.auth.signOut();
    redirect("/studio/login");
  }

  return {
    db: sb,
    user,
    studioUser: {
      id: adminProfile.user_id,
      email: user.email ?? "",
      display_name: adminProfile.display_name,
      role: adminProfile.role,
      status: adminProfile.status,
      created_at: adminProfile.created_at,
      last_login_at: adminProfile.last_login_at,
    },
  };
}

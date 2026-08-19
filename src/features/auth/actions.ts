"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/server";

export async function signOutStudio() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/studio/login");
}

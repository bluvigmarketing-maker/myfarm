"use server";

import { createClient } from "@/lib/supabase/server";

export async function logPageView(path: string, sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("page_views").insert({
    path,
    session_id: sessionId,
    visitor_id: user?.id ?? null,
  });
}

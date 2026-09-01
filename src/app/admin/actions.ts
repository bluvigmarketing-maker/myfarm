"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/auth/dal";

export async function verifyFarmer(farmerId: string) {
  await verifyAdmin();
  const supabase = await createClient();

  await supabase.from("farmer_profiles").update({ verified: true }).eq("id", farmerId);

  revalidatePath("/admin");
}

export async function updateReportStatus(reportId: string, status: "resolved" | "dismissed") {
  await verifyAdmin();
  const supabase = await createClient();

  await supabase.from("reports").update({ status }).eq("id", reportId);

  revalidatePath("/admin");
}

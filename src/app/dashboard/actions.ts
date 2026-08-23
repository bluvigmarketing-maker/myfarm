"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/dal";
import { isValidGoogleMapsLink, parseLatLngFromGoogleMapsLink } from "@/lib/gmaps";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function splitTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildSchedule(formData: FormData) {
  const openTime = String(formData.get("open_time") ?? "");
  const closeTime = String(formData.get("close_time") ?? "");
  const openDays = DAYS.filter((day) => formData.get(`day_${day}`) === "on");

  if (!openTime || !closeTime || openDays.length === 0) return [];

  return openDays.map((day) => ({
    day_of_week: day,
    open_time: openTime,
    close_time: closeTime,
  }));
}

export async function becomeFarmer(formData: FormData) {
  const user = await verifySession();
  const supabase = await createClient();

  const yearsExperience = Number(formData.get("years_experience") ?? 0) || null;
  const specialties = splitTags(formData.get("specialties"));
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim();

  if (!whatsappNumber) {
    redirect(`/dashboard?error=${encodeURIComponent("A WhatsApp number is required so visitors can book visits.")}`);
  }

  await supabase.from("users").update({ whatsapp_number: whatsappNumber }).eq("id", user.id);

  const { error } = await supabase.from("farmer_profiles").insert({
    user_id: user.id,
    years_experience: yearsExperience,
    specialties,
  });

  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createFarm(formData: FormData) {
  const user = await verifySession();
  const supabase = await createClient();

  const { data: farmerProfile } = await supabase
    .from("farmer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!farmerProfile) {
    redirect("/dashboard");
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const gmapsLink = String(formData.get("gmaps_link") ?? "").trim();
  const tags = splitTags(formData.get("tags"));

  if (!name) {
    redirect(`/dashboard/farms/new?error=${encodeURIComponent("Farm name is required.")}`);
  }

  if (gmapsLink && !isValidGoogleMapsLink(gmapsLink)) {
    redirect(
      `/dashboard/farms/new?error=${encodeURIComponent("That doesn't look like a Google Maps link.")}`
    );
  }

  const coords = gmapsLink ? parseLatLngFromGoogleMapsLink(gmapsLink) : null;

  const { data: farm, error } = await supabase
    .from("farms")
    .insert({
      farmer_id: farmerProfile.id,
      name,
      description,
      gmaps_link: gmapsLink || null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      tags,
      status: "closed",
    })
    .select("id")
    .single();

  if (error || !farm) {
    redirect(`/dashboard/farms/new?error=${encodeURIComponent(error?.message ?? "Could not create farm.")}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/farms/${farm.id}/edit`);
}

export async function updateFarm(farmId: string, formData: FormData) {
  await verifySession();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const gmapsLink = String(formData.get("gmaps_link") ?? "").trim();
  const tags = splitTags(formData.get("tags"));
  const status = formData.get("status") === "open" ? "open" : "closed";

  if (gmapsLink && !isValidGoogleMapsLink(gmapsLink)) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("That doesn't look like a Google Maps link.")}`
    );
  }

  const coords = gmapsLink ? parseLatLngFromGoogleMapsLink(gmapsLink) : null;
  const schedule = buildSchedule(formData);

  const { error } = await supabase
    .from("farms")
    .update({
      name,
      description,
      gmaps_link: gmapsLink || null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      tags,
      status,
      schedule,
      updated_at: new Date().toISOString(),
    })
    .eq("id", farmId);

  if (error) {
    redirect(`/dashboard/farms/${farmId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  redirect(`/dashboard/farms/${farmId}/edit?saved=1`);
}

export async function setFarmStatus(farmId: string, status: "open" | "closed") {
  await verifySession();
  const supabase = await createClient();

  await supabase.from("farms").update({ status }).eq("id", farmId);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/farms/${farmId}/edit`);
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/dal";
import { isValidGoogleMapsLink, parseLatLngFromGoogleMapsLink } from "@/lib/gmaps";
import { isValidIntroVideoLink } from "@/lib/video";
import { FARM_MEDIA_BUCKET, storagePathFromPublicUrl } from "@/lib/storage";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const MAX_FARM_PHOTOS = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FARM_CATEGORIES = ["company_organization", "school", "family_personal"] as const;
const STOCK_STATUSES = ["in_stock", "out_of_stock", "seasonal"] as const;

function parseStockStatus(raw: FormDataEntryValue | null): (typeof STOCK_STATUSES)[number] {
  const value = String(raw ?? "");
  return (STOCK_STATUSES as readonly string[]).includes(value)
    ? (value as (typeof STOCK_STATUSES)[number])
    : "in_stock";
}

function parsePrice(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseCategory(raw: FormDataEntryValue | null): (typeof FARM_CATEGORIES)[number] {
  const value = String(raw ?? "");
  return (FARM_CATEGORIES as readonly string[]).includes(value)
    ? (value as (typeof FARM_CATEGORIES)[number])
    : "family_personal";
}

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
  const category = parseCategory(formData.get("category"));

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
      category,
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
  const introVideoUrl = String(formData.get("intro_video_url") ?? "").trim();
  const tags = splitTags(formData.get("tags"));
  const status = formData.get("status") === "open" ? "open" : "closed";
  const category = parseCategory(formData.get("category"));
  const priceAgroVisit = parsePrice(formData.get("price_agro_visit"));
  const priceTraining = parsePrice(formData.get("price_training"));

  if (gmapsLink && !isValidGoogleMapsLink(gmapsLink)) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("That doesn't look like a Google Maps link.")}`
    );
  }

  if (introVideoUrl && !isValidIntroVideoLink(introVideoUrl)) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Video link must be a Facebook, YouTube, or TikTok URL.")}`
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
      intro_video_url: introVideoUrl || null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      tags,
      category,
      status,
      schedule,
      price_agro_visit: priceAgroVisit,
      price_training: priceTraining,
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

export async function uploadFeaturedImage(farmId: string, formData: FormData) {
  await verifySession();
  const supabase = await createClient();

  const file = formData.get("cover_photo");

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Choose an image to upload.")}`);
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Please upload a JPEG, PNG, or WEBP image.")}`
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${farmId}/cover-${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(FARM_MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    redirect(`/dashboard/farms/${farmId}/edit?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data } = supabase.storage.from(FARM_MEDIA_BUCKET).getPublicUrl(path);
  await supabase.from("farms").update({ cover_photo_url: data.publicUrl }).eq("id", farmId);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath("/farms");
  revalidatePath(`/farms/${farmId}`);
  redirect(`/dashboard/farms/${farmId}/edit?saved=1`);
}

export async function uploadFarmPhotos(farmId: string, formData: FormData) {
  await verifySession();
  const supabase = await createClient();

  const { count } = await supabase
    .from("farm_photos")
    .select("id", { count: "exact", head: true })
    .eq("farm_id", farmId);

  const existing = count ?? 0;
  const remaining = MAX_FARM_PHOTOS - existing;

  if (remaining <= 0) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("You already have 5 photos — remove one before adding more.")}`
    );
  }

  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0 && ALLOWED_IMAGE_TYPES.includes(entry.type));

  if (files.length === 0) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Choose at least one JPEG, PNG, or WEBP image.")}`
    );
  }

  const toUpload = files.slice(0, remaining);

  for (const [index, file] of toUpload.entries()) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${farmId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(FARM_MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type });

    if (uploadError) continue;

    const { data } = supabase.storage.from(FARM_MEDIA_BUCKET).getPublicUrl(path);
    await supabase.from("farm_photos").insert({
      farm_id: farmId,
      url: data.publicUrl,
      sort_order: existing + index,
    });
  }

  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath(`/farms/${farmId}`);
  redirect(`/dashboard/farms/${farmId}/edit?saved=1`);
}

export async function deleteFarmPhoto(farmId: string, photoId: string) {
  await verifySession();
  const supabase = await createClient();

  const { data: photo } = await supabase
    .from("farm_photos")
    .select("url")
    .eq("id", photoId)
    .maybeSingle();

  if (photo?.url) {
    const path = storagePathFromPublicUrl(photo.url);
    if (path) {
      await supabase.storage.from(FARM_MEDIA_BUCKET).remove([path]);
    }
  }

  await supabase.from("farm_photos").delete().eq("id", photoId);

  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath(`/farms/${farmId}`);
}

export async function addProduct(farmId: string, formData: FormData) {
  await verifySession();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  const unit = String(formData.get("unit") ?? "").trim() || "unit";
  const file = formData.get("photo");

  if (!name || price == null) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Product name and a valid price are required.")}`
    );
  }

  let photoUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      redirect(
        `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Product photo must be JPEG, PNG, or WEBP.")}`
      );
    }
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${farmId}/product-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(FARM_MEDIA_BUCKET)
      .upload(path, file, { contentType: file.type });
    if (!uploadError) {
      photoUrl = supabase.storage.from(FARM_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    }
  }

  const { error } = await supabase.from("products").insert({
    farm_id: farmId,
    name,
    description: description || null,
    price,
    unit,
    photo_url: photoUrl,
  });

  if (error) {
    redirect(`/dashboard/farms/${farmId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath("/market");
  redirect(`/dashboard/farms/${farmId}/edit?saved=1`);
}

export async function updateProduct(farmId: string, productId: string, formData: FormData) {
  await verifySession();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  const unit = String(formData.get("unit") ?? "").trim() || "unit";
  const stockStatus = parseStockStatus(formData.get("stock_status"));

  if (!name || price == null) {
    redirect(
      `/dashboard/farms/${farmId}/edit?error=${encodeURIComponent("Product name and a valid price are required.")}`
    );
  }

  const { error } = await supabase
    .from("products")
    .update({ name, description: description || null, price, unit, stock_status: stockStatus })
    .eq("id", productId);

  if (error) {
    redirect(`/dashboard/farms/${farmId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath("/market");
  redirect(`/dashboard/farms/${farmId}/edit?saved=1`);
}

export async function deleteProduct(farmId: string, productId: string) {
  await verifySession();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("photo_url")
    .eq("id", productId)
    .maybeSingle();

  if (product?.photo_url) {
    const path = storagePathFromPublicUrl(product.photo_url);
    if (path) {
      await supabase.storage.from(FARM_MEDIA_BUCKET).remove([path]);
    }
  }

  await supabase.from("products").delete().eq("id", productId);

  revalidatePath(`/dashboard/farms/${farmId}/edit`);
  revalidatePath("/market");
}

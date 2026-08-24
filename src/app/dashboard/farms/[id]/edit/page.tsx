import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toEmbedSrc } from "@/lib/gmaps";
import { FARM_CATEGORY_OPTIONS } from "@/lib/farm-category";
import {
  updateFarm,
  setFarmStatus,
  uploadFeaturedImage,
  uploadFarmPhotos,
  deleteFarmPhoto,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../actions";
import { Button } from "@/components/ui/button";

const STOCK_STATUS_OPTIONS = [
  { value: "in_stock", label: "In stock" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "seasonal", label: "Seasonal" },
] as const;

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

const MAX_FARM_PHOTOS = 5;

type ScheduleEntry = { day_of_week: string; open_time: string; close_time: string };

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export default async function EditFarmPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;

  const supabase = await createClient();
  const { data: farm } = await supabase.from("farms").select("*").eq("id", id).maybeSingle();

  if (!farm) {
    notFound();
  }

  const { data: photos } = await supabase
    .from("farm_photos")
    .select("id, url")
    .eq("farm_id", id)
    .order("sort_order", { ascending: true });

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, photo_url, price, unit, stock_status")
    .eq("farm_id", id)
    .order("created_at", { ascending: false });

  const updateFarmWithId = updateFarm.bind(null, farm.id);
  const addProductWithId = addProduct.bind(null, farm.id);
  const openFarm = setFarmStatus.bind(null, farm.id, "open");
  const closeFarm = setFarmStatus.bind(null, farm.id, "closed");
  const uploadFeaturedImageWithId = uploadFeaturedImage.bind(null, farm.id);
  const uploadFarmPhotosWithId = uploadFarmPhotos.bind(null, farm.id);
  const embedSrc = farm.gmaps_link ? toEmbedSrc(farm.gmaps_link) : null;
  const schedule: ScheduleEntry[] = Array.isArray(farm.schedule) ? farm.schedule : [];
  const scheduledDays = new Set(schedule.map((entry) => entry.day_of_week));
  const defaultOpenTime = schedule[0]?.open_time ?? "08:00";
  const defaultCloseTime = schedule[0]?.close_time ?? "16:00";
  const photoCount = photos?.length ?? 0;

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-green-950">{farm.name}</h1>
        <form action={farm.status === "open" ? closeFarm : openFarm}>
          <Button
            type="submit"
            variant={farm.status === "open" ? "secondary" : "default"}
            className={farm.status === "open" ? undefined : "btn-earthy soil-line"}
          >
            {farm.status === "open" ? "Mark Closed" : "Mark Open"}
          </Button>
        </form>
      </div>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      {saved && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">Saved.</p>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium text-green-950">Featured Image</h2>
        <p className="text-xs text-green-600">
          Shown on the farm listing page (/farms). Recommended: a wide, bright photo.
        </p>
        {farm.cover_photo_url && (
          <Image
            src={farm.cover_photo_url}
            alt="Featured"
            width={400}
            height={225}
            unoptimized
            className="h-40 w-full rounded-lg object-cover"
          />
        )}
        <form action={uploadFeaturedImageWithId} className="flex items-center gap-3">
          <input
            type="file"
            name="cover_photo"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-sm text-green-800"
          />
          <Button type="submit" size="sm" className="btn-earthy soil-line font-semibold">
            Upload
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium text-green-950">
          Gallery Photos ({photoCount}/{MAX_FARM_PHOTOS})
        </h2>
        {photos && photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <Image
                  src={photo.url}
                  alt=""
                  width={150}
                  height={150}
                  unoptimized
                  className="h-24 w-full rounded-lg object-cover"
                />
                <form action={deleteFarmPhoto.bind(null, farm.id, photo.id)}>
                  <button
                    type="submit"
                    className="absolute top-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
        {photoCount < MAX_FARM_PHOTOS && (
          <form action={uploadFarmPhotosWithId} className="flex items-center gap-3">
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              className="text-sm text-green-800"
            />
            <Button type="submit" size="sm" className="btn-earthy soil-line font-semibold">
              Add Photos
            </Button>
          </form>
        )}
      </div>

      {embedSrc && (
        <iframe
          src={embedSrc}
          className="h-48 w-full rounded-2xl border border-border"
          loading="lazy"
        />
      )}

      <form action={updateFarmWithId} className="flex flex-col gap-4">
        <input type="hidden" name="status" value={farm.status} />

        <label className={labelClass}>
          Farm name
          <input type="text" name="name" defaultValue={farm.name} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Category
          <select name="category" required defaultValue={farm.category} className={inputClass}>
            {FARM_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={farm.description ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Intro video link (Facebook, YouTube, or TikTok)
          <input
            type="url"
            name="intro_video_url"
            defaultValue={farm.intro_video_url ?? ""}
            placeholder="https://youtube.com/watch?v=..."
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Google Maps link
          <input
            type="url"
            name="gmaps_link"
            defaultValue={farm.gmaps_link ?? ""}
            placeholder="https://maps.app.goo.gl/..."
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Tags (comma separated)
          <input
            type="text"
            name="tags"
            defaultValue={(farm.tags ?? []).join(", ")}
            className={inputClass}
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-green-900">Pricing</legend>
          <div className="flex gap-3">
            <label className={labelClass}>
              Agro-visit price
              <input
                type="number"
                name="price_agro_visit"
                min={0}
                step="0.01"
                defaultValue={farm.price_agro_visit ?? ""}
                placeholder="Leave blank if free"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Training price
              <input
                type="number"
                name="price_training"
                min={0}
                step="0.01"
                defaultValue={farm.price_training ?? ""}
                placeholder="Leave blank if not offered"
                className={inputClass}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-green-900">Weekly schedule</legend>
          <div className="flex flex-wrap gap-3">
            {DAYS.map((day) => (
              <label key={day.key} className="flex items-center gap-1 text-sm text-green-800">
                <input
                  type="checkbox"
                  name={`day_${day.key}`}
                  defaultChecked={scheduledDays.has(day.key)}
                />
                {day.label}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <label className={labelClass}>
              Open time
              <input type="time" name="open_time" defaultValue={defaultOpenTime} className={inputClass} />
            </label>
            <label className={labelClass}>
              Close time
              <input type="time" name="close_time" defaultValue={defaultCloseTime} className={inputClass} />
            </label>
          </div>
        </fieldset>

        <Button type="submit" className="btn-earthy soil-line font-semibold">
          Save Changes
        </Button>
      </form>

      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <div>
          <h2 className="font-heading text-lg font-medium text-green-950">Farm Shop</h2>
          <p className="text-xs text-green-600">
            Sell produce at farm price. Shown on the public Market page —
            visitors order straight through WhatsApp.
          </p>
        </div>

        {products && products.length > 0 && (
          <ul className="flex flex-col gap-3">
            {products.map((product) => (
              <li key={product.id} className="rounded-lg border border-green-200 p-3">
                <div className="flex gap-3">
                  {product.photo_url && (
                    <Image
                      src={product.photo_url}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 rounded-md object-cover"
                    />
                  )}
                  <form
                    action={updateProduct.bind(null, farm.id, product.id)}
                    className="flex flex-1 flex-col gap-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="name"
                        defaultValue={product.name}
                        required
                        className={`flex-1 ${inputClass}`}
                      />
                      <input
                        type="number"
                        name="price"
                        min={0}
                        step="0.01"
                        defaultValue={product.price}
                        required
                        className={`w-24 ${inputClass}`}
                      />
                      <input
                        type="text"
                        name="unit"
                        defaultValue={product.unit}
                        placeholder="unit"
                        className={`w-24 ${inputClass}`}
                      />
                    </div>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={product.description ?? ""}
                      placeholder="Description (optional)"
                      className={inputClass}
                    />
                    <div className="flex items-center gap-2">
                      <select
                        name="stock_status"
                        defaultValue={product.stock_status}
                        className={inputClass}
                      >
                        {STOCK_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" className="btn-earthy soil-line font-semibold">
                        Save
                      </Button>
                    </div>
                  </form>
                  <form action={deleteProduct.bind(null, farm.id, product.id)}>
                    <button
                      type="submit"
                      aria-label="Delete product"
                      className="rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form action={addProductWithId} className="flex flex-col gap-2 rounded-lg border border-dashed border-green-300 p-3">
          <h3 className="text-sm font-medium text-green-900">Add a product</h3>
          <div className="flex gap-2">
            <input type="text" name="name" placeholder="Name" required className={`flex-1 ${inputClass}`} />
            <input
              type="number"
              name="price"
              min={0}
              step="0.01"
              placeholder="Price"
              required
              className={`w-24 ${inputClass}`}
            />
            <input type="text" name="unit" placeholder="unit (kg, dozen...)" className={`w-32 ${inputClass}`} />
          </div>
          <textarea name="description" rows={2} placeholder="Description (optional)" className={inputClass} />
          <div className="flex items-center gap-3">
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="text-sm text-green-800" />
            <Button type="submit" size="sm" className="btn-earthy soil-line font-semibold">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

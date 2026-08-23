import { createFarm } from "../../actions";
import { Button } from "@/components/ui/button";
import { FARM_CATEGORY_OPTIONS } from "@/lib/farm-category";

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export default async function NewFarmPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-green-950">Add a Farm</h1>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <form action={createFarm} className="flex flex-col gap-4">
        <label className={labelClass}>
          Farm name
          <input type="text" name="name" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Category
          <select name="category" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select a category
            </option>
            {FARM_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Description
          <textarea name="description" rows={4} className={inputClass} />
        </label>
        <label className={labelClass}>
          Google Maps link
          <input
            type="url"
            name="gmaps_link"
            placeholder="https://maps.app.goo.gl/..."
            className={inputClass}
          />
          <span className="text-xs font-normal text-green-600">
            Open your farm&apos;s location in Google Maps, tap Share, and paste
            the link here.
          </span>
        </label>
        <label className={labelClass}>
          Tags (comma separated)
          <input
            type="text"
            name="tags"
            placeholder="organic, rice, training"
            className={inputClass}
          />
        </label>
        <Button type="submit" className="btn-earthy soil-line font-semibold">
          Create Farm
        </Button>
      </form>
    </div>
  );
}

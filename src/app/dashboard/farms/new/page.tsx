import { createFarm } from "../../actions";

export default async function NewFarmPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-stone-900">Add a Farm</h1>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={createFarm} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Farm name
          <input
            type="text"
            name="name"
            required
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea
            name="description"
            rows={4}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Google Maps link
          <input
            type="url"
            name="gmaps_link"
            placeholder="https://maps.app.goo.gl/..."
            className="rounded-md border border-stone-300 px-3 py-2"
          />
          <span className="text-xs text-stone-500">
            Open your farm&apos;s location in Google Maps, tap Share, and paste
            the link here.
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tags (comma separated)
          <input
            type="text"
            name="tags"
            placeholder="organic, rice, training"
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
        >
          Create Farm
        </button>
      </form>
    </div>
  );
}

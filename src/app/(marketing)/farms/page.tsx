import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; open?: string }>;
}) {
  const { q, open } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("farms")
    .select("id, name, description, tags, status")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }
  if (open === "1") {
    query = query.eq("status", "open");
  }

  const { data: farms } = await query;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold text-stone-900">Find a Farm</h1>
      <p className="mt-1 text-stone-600">
        Browse farms open for training visits and agro-tourism.
      </p>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/farms">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by farm name..."
          className="min-w-[200px] flex-1 rounded-md border border-stone-300 px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input type="checkbox" name="open" value="1" defaultChecked={open === "1"} />
          Open now
        </label>
        <button
          type="submit"
          className="rounded-full bg-green-800 px-5 py-2 text-sm font-medium text-white hover:bg-green-900"
        >
          Search
        </button>
      </form>

      {(!farms || farms.length === 0) && (
        <p className="mt-10 text-stone-600">No farms match your search yet.</p>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {farms?.map((farm) => (
          <li key={farm.id}>
            <Link
              href={`/farms/${farm.id}`}
              className="flex h-full flex-col gap-2 rounded-lg border border-stone-200 bg-white p-5 hover:border-green-700"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-900">{farm.name}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    farm.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {farm.status === "open" ? "Open" : "Closed"}
                </span>
              </div>
              {farm.description && (
                <p className="line-clamp-2 text-sm text-stone-600">{farm.description}</p>
              )}
              {farm.tags && farm.tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {farm.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

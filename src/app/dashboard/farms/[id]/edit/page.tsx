import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toEmbedSrc } from "@/lib/gmaps";
import { updateFarm, setFarmStatus } from "../../../actions";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

type ScheduleEntry = { day_of_week: string; open_time: string; close_time: string };

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

  const updateFarmWithId = updateFarm.bind(null, farm.id);
  const openFarm = setFarmStatus.bind(null, farm.id, "open");
  const closeFarm = setFarmStatus.bind(null, farm.id, "closed");
  const embedSrc = farm.gmaps_link ? toEmbedSrc(farm.gmaps_link) : null;
  const schedule: ScheduleEntry[] = Array.isArray(farm.schedule) ? farm.schedule : [];
  const scheduledDays = new Set(schedule.map((entry) => entry.day_of_week));
  const defaultOpenTime = schedule[0]?.open_time ?? "08:00";
  const defaultCloseTime = schedule[0]?.close_time ?? "16:00";

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">{farm.name}</h1>
        <form action={farm.status === "open" ? closeFarm : openFarm}>
          <button
            type="submit"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              farm.status === "open"
                ? "bg-stone-200 text-stone-700 hover:bg-stone-300"
                : "bg-green-800 text-white hover:bg-green-900"
            }`}
          >
            {farm.status === "open" ? "Mark Closed" : "Mark Open"}
          </button>
        </form>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">Saved.</p>
      )}

      {embedSrc && (
        <iframe
          src={embedSrc}
          className="h-48 w-full rounded-lg border border-stone-200"
          loading="lazy"
        />
      )}

      <form action={updateFarmWithId} className="flex flex-col gap-4">
        <input type="hidden" name="status" value={farm.status} />

        <label className="flex flex-col gap-1 text-sm">
          Farm name
          <input
            type="text"
            name="name"
            defaultValue={farm.name}
            required
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={farm.description ?? ""}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Google Maps link
          <input
            type="url"
            name="gmaps_link"
            defaultValue={farm.gmaps_link ?? ""}
            placeholder="https://maps.app.goo.gl/..."
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tags (comma separated)
          <input
            type="text"
            name="tags"
            defaultValue={(farm.tags ?? []).join(", ")}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-stone-700">Weekly schedule</legend>
          <div className="flex flex-wrap gap-3">
            {DAYS.map((day) => (
              <label key={day.key} className="flex items-center gap-1 text-sm">
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
            <label className="flex flex-col gap-1 text-sm">
              Open time
              <input
                type="time"
                name="open_time"
                defaultValue={defaultOpenTime}
                className="rounded-md border border-stone-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Close time
              <input
                type="time"
                name="close_time"
                defaultValue={defaultCloseTime}
                className="rounded-md border border-stone-300 px-3 py-2"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

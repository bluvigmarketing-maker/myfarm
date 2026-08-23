import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toEmbedSrc } from "@/lib/gmaps";
import { updateFarm, setFarmStatus } from "../../../actions";
import { Button } from "@/components/ui/button";

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
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={farm.description ?? ""}
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
    </div>
  );
}

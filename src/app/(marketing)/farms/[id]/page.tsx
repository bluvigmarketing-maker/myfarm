import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toEmbedSrc } from "@/lib/gmaps";
import { WhatsAppBookingForm } from "@/components/whatsapp-booking-form";

const DAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

type ScheduleEntry = { day_of_week: string; open_time: string; close_time: string };

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: farm } = await supabase
    .from("farms")
    .select(
      "*, farmer_profiles(id, verified, years_experience, users(name, whatsapp_number))"
    )
    .eq("id", id)
    .maybeSingle();

  if (!farm) {
    notFound();
  }

  const embedSrc = farm.gmaps_link ? toEmbedSrc(farm.gmaps_link) : null;
  const schedule: ScheduleEntry[] = Array.isArray(farm.schedule) ? farm.schedule : [];
  const farmer = farm.farmer_profiles as {
    verified: boolean;
    years_experience: number | null;
    users: { name: string; whatsapp_number: string | null } | null;
  } | null;
  const whatsappNumber = farmer?.users?.whatsapp_number;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900">{farm.name}</h1>
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

      {farmer?.users?.name && (
        <p className="mt-1 text-sm text-stone-500">
          Hosted by {farmer.users.name}
          {farmer.verified ? " · Verified" : ""}
          {farmer.years_experience ? ` · ${farmer.years_experience} yrs experience` : ""}
        </p>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div className="flex flex-col gap-6 sm:col-span-2">
          {farm.description && <p className="text-stone-700">{farm.description}</p>}

          {farm.tags && farm.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          {schedule.length > 0 && (
            <div>
              <h2 className="font-medium text-stone-900">Weekly Hours</h2>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-stone-600">
                {schedule.map((entry) => (
                  <li
                    key={entry.day_of_week}
                    className="rounded-md bg-stone-100 px-2.5 py-1"
                  >
                    {DAY_LABELS[entry.day_of_week] ?? entry.day_of_week} {entry.open_time}–
                    {entry.close_time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {embedSrc ? (
            <iframe
              src={embedSrc}
              className="h-64 w-full rounded-lg border border-stone-200"
              loading="lazy"
            />
          ) : (
            farm.gmaps_link && (
              <a
                href={farm.gmaps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-800 hover:underline"
              >
                Open location in Google Maps
              </a>
            )
          )}
        </div>

        <div className="flex flex-col gap-4">
          {whatsappNumber ? (
            <WhatsAppBookingForm farmName={farm.name} whatsappNumber={whatsappNumber} />
          ) : (
            <p className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-500">
              This farmer hasn&apos;t added a WhatsApp number yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

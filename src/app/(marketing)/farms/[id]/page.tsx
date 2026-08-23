import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toEmbedSrc } from "@/lib/gmaps";
import { WhatsAppBookingForm } from "@/components/whatsapp-booking-form";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

  const hostLine = farmer?.users?.name
    ? `Hosted by ${farmer.users.name}${farmer.verified ? " · Verified" : ""}${
        farmer.years_experience ? ` · ${farmer.years_experience} yrs experience` : ""
      }`
    : undefined;

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow={farm.status === "open" ? "Open Now" : "Currently Closed"}
        title={farm.name}
        description={hostLine}
      />

      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-6 sm:col-span-2">
          <AnimatedSection>
            <div className="flex flex-col gap-6">
              {farm.description && <p className="text-green-800">{farm.description}</p>}

              {farm.tags && farm.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {farm.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="soil-line text-green-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {schedule.length > 0 && (
                <div>
                  <h2 className="font-heading text-lg font-medium text-green-950">
                    Weekly Hours
                  </h2>
                  <ul className="mt-2 flex flex-wrap gap-2 text-sm text-green-800">
                    {schedule.map((entry) => (
                      <li
                        key={entry.day_of_week}
                        className="rounded-md bg-green-50 px-2.5 py-1"
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
                  className="h-64 w-full rounded-2xl border border-border"
                  loading="lazy"
                />
              ) : (
                farm.gmaps_link && (
                  <a
                    href={farm.gmaps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brown-700 hover:underline"
                  >
                    Open location in Google Maps
                  </a>
                )
              )}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.1} className="flex flex-col gap-4">
          {whatsappNumber ? (
            <WhatsAppBookingForm farmName={farm.name} whatsappNumber={whatsappNumber} />
          ) : (
            <Card className="soil-line">
              <CardContent className="text-sm text-green-700">
                This farmer hasn&apos;t added a WhatsApp number yet.
              </CardContent>
            </Card>
          )}
        </AnimatedSection>
      </Container>
    </main>
  );
}

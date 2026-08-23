import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Discover"
        title="Find a Farm"
        description="Browse farms open for training visits and agro-tourism."
      />

      <Container className="flex flex-col gap-8 py-12">
        <form className="flex flex-wrap items-center gap-3" action="/farms">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by farm name..."
            className="min-w-[200px] flex-1 rounded-lg border border-input px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40"
          />
          <label className="flex items-center gap-2 text-sm text-green-800">
            <input type="checkbox" name="open" value="1" defaultChecked={open === "1"} />
            Open now
          </label>
          <Button type="submit" className="btn-earthy soil-line font-semibold">
            Search
          </Button>
        </form>

        {(!farms || farms.length === 0) && (
          <p className="text-green-700">No farms match your search yet.</p>
        )}

        <ul className="grid gap-4 sm:grid-cols-2">
          {farms?.map((farm, index) => (
            <li key={farm.id}>
              <AnimatedSection delay={index * 0.05}>
                <Link href={`/farms/${farm.id}`} className="block h-full">
                  <Card className="soil-line h-full transition-transform hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-medium text-green-950">
                          {farm.name}
                        </span>
                        <Badge variant={farm.status === "open" ? "default" : "outline"}>
                          {farm.status === "open" ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      {farm.description && (
                        <p className="line-clamp-2 text-sm text-green-700">{farm.description}</p>
                      )}
                      {farm.tags && farm.tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-2 pt-2">
                          {farm.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="soil-line text-green-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}

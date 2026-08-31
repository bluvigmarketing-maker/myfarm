import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketOrderButton } from "@/components/market-order-button";

type MarketProduct = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  price: number;
  unit: string;
  stock_status: "in_stock" | "out_of_stock" | "seasonal";
  farms: {
    id: string;
    name: string;
    farmer_profiles: { users: { whatsapp_number: string | null } | null } | null;
  } | null;
};

const STOCK_LABELS: Record<string, string> = {
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  seasonal: "Seasonal",
};

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id, name, description, photo_url, price, unit, stock_status, farms(id, name, farmer_profiles(users(whatsapp_number)))"
    )
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data } = await query;
  const products = (data ?? []) as unknown as MarketProduct[];

  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Farm Shop"
        title="The Market"
        description="Produce straight from the farms on Shamba Spot, sold at farm price. Order right on WhatsApp."
      />

      <Container className="flex flex-col gap-8 py-12">
        <form className="flex items-center gap-3" action="/market">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search products..."
            className="min-w-[200px] flex-1 rounded-lg border border-input px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40"
          />
          <Button type="submit" className="btn-earthy soil-line font-semibold">
            Search
          </Button>
        </form>

        {products.length === 0 && (
          <p className="text-green-700">No products listed yet — check back soon!</p>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const whatsappNumber = product.farms?.farmer_profiles?.users?.whatsapp_number;
            return (
              <li key={product.id}>
                <AnimatedSection delay={index * 0.05}>
                  <Card className="soil-line h-full overflow-hidden">
                    {product.photo_url && (
                      <Image
                        src={product.photo_url}
                        alt={product.name}
                        width={300}
                        height={180}
                        unoptimized
                        className="h-36 w-full object-cover"
                      />
                    )}
                    <CardContent className="flex h-full flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-medium text-green-950">
                          {product.name}
                        </span>
                        <Badge variant={product.stock_status === "in_stock" ? "default" : "outline"}>
                          {STOCK_LABELS[product.stock_status]}
                        </Badge>
                      </div>
                      {product.farms && (
                        <Link
                          href={`/farms/${product.farms.id}`}
                          className="text-xs font-medium text-brown-700 hover:underline"
                        >
                          {product.farms.name}
                        </Link>
                      )}
                      {product.description && (
                        <p className="line-clamp-2 text-sm text-green-700">{product.description}</p>
                      )}
                      <span className="font-heading text-lg font-semibold text-green-950">
                        ${product.price}
                        <span className="text-sm font-normal text-green-600"> / {product.unit}</span>
                      </span>
                      {product.stock_status === "in_stock" && whatsappNumber && product.farms && (
                        <MarketOrderButton
                          farmName={product.farms.name}
                          productName={product.name}
                          unit={product.unit}
                          whatsappNumber={whatsappNumber}
                        />
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </li>
            );
          })}
        </ul>
      </Container>
    </main>
  );
}

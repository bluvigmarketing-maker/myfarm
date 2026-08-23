import Link from "next/link";
import { verifySession, getFarmerProfile } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { becomeFarmer } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await verifySession();
  const farmerProfile = await getFarmerProfile();

  if (!farmerProfile) {
    return (
      <div className="flex max-w-md flex-col gap-4">
        <h1 className="font-heading text-xl font-semibold text-green-950">
          Welcome, {user.email}
        </h1>
        <p className="text-green-700">
          Ready to open your farm to visitors? Become a Model Farmer to create
          your farm profile.
        </p>
        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <form action={becomeFarmer} className="flex flex-col gap-4">
          <label className={labelClass}>
            WhatsApp number
            <input
              type="tel"
              name="whatsapp_number"
              required
              placeholder="+1 555 123 4567"
              className={inputClass}
            />
            <span className="text-xs font-normal text-green-600">
              Visitors will use this to reach you and book visits.
            </span>
          </label>
          <label className={labelClass}>
            Years of farming experience
            <input type="number" name="years_experience" min={0} className={inputClass} />
          </label>
          <label className={labelClass}>
            Specialties (comma separated)
            <input
              type="text"
              name="specialties"
              placeholder="rice, poultry, organic"
              className={inputClass}
            />
          </label>
          <Button type="submit" className="btn-earthy soil-line font-semibold">
            Become a Model Farmer
          </Button>
        </form>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: farms } = await supabase
    .from("farms")
    .select("id, name, status")
    .eq("farmer_id", farmerProfile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-green-950">Your Farms</h1>
        <Button
          className="btn-earthy soil-line font-semibold"
          nativeButton={false}
          render={<Link href="/dashboard/farms/new" />}
        >
          + Add Farm
        </Button>
      </div>

      {(!farms || farms.length === 0) && (
        <p className="text-green-700">You haven&apos;t added a farm yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {farms?.map((farm) => (
          <li key={farm.id}>
            <Card className="soil-line">
              <CardContent className="flex items-center justify-between">
                <span className="font-medium text-green-950">{farm.name}</span>
                <div className="flex items-center gap-3">
                  <Badge variant={farm.status === "open" ? "default" : "outline"}>
                    {farm.status === "open" ? "Open" : "Closed"}
                  </Badge>
                  <Link
                    href={`/dashboard/farms/${farm.id}/edit`}
                    className="text-sm font-medium text-brown-700 hover:underline"
                  >
                    Manage
                  </Link>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

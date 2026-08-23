import Link from "next/link";
import { verifySession, getFarmerProfile } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { becomeFarmer } from "./actions";

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
        <h1 className="text-xl font-semibold text-stone-900">Welcome, {user.email}</h1>
        <p className="text-stone-600">
          Ready to open your farm to visitors? Become a Model Farmer to create
          your farm profile.
        </p>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <form action={becomeFarmer} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            WhatsApp number
            <input
              type="tel"
              name="whatsapp_number"
              required
              placeholder="+1 555 123 4567"
              className="rounded-md border border-stone-300 px-3 py-2"
            />
            <span className="text-xs text-stone-500">
              Visitors will use this to reach you and book visits.
            </span>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Years of farming experience
            <input
              type="number"
              name="years_experience"
              min={0}
              className="rounded-md border border-stone-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Specialties (comma separated)
            <input
              type="text"
              name="specialties"
              placeholder="rice, poultry, organic"
              className="rounded-md border border-stone-300 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
          >
            Become a Model Farmer
          </button>
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
        <h1 className="text-xl font-semibold text-stone-900">Your Farms</h1>
        <Link
          href="/dashboard/farms/new"
          className="rounded-full bg-green-800 px-4 py-2 text-sm font-medium text-white hover:bg-green-900"
        >
          + Add Farm
        </Link>
      </div>

      {(!farms || farms.length === 0) && (
        <p className="text-stone-600">You haven&apos;t added a farm yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {farms?.map((farm) => (
          <li
            key={farm.id}
            className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
          >
            <span className="font-medium text-stone-900">{farm.name}</span>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  farm.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {farm.status === "open" ? "Open" : "Closed"}
              </span>
              <Link
                href={`/dashboard/farms/${farm.id}/edit`}
                className="text-sm font-medium text-green-800 hover:underline"
              >
                Manage
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

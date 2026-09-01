import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";
import { VisitorsChart, type DayStat } from "@/components/admin/visitors-chart";
import { verifyFarmer, updateReportStatus } from "./actions";

const CHART_DAYS = 14;

type ActivityItem = { type: string; label: string; timestamp: string };

function buildChartDays(since: Date): DayStat[] {
  const days: DayStat[] = [];
  for (let i = 0; i < CHART_DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      visitors: 0,
      views: 0,
    });
  }
  return days;
}

function timeAgo(timestamp: string) {
  const seconds = Math.max(0, (Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const since14 = new Date();
  since14.setDate(since14.getDate() - (CHART_DAYS - 1));
  since14.setHours(0, 0, 0, 0);

  const since7 = new Date();
  since7.setDate(since7.getDate() - 6);
  since7.setHours(0, 0, 0, 0);

  const [
    { count: totalUsers },
    { count: totalFarms },
    { count: openFarms },
    { count: totalBookings },
    { count: totalProducts },
    { data: windowViews },
    { data: recentPageViews },
    { data: pendingFarmers },
    { data: openReports },
    { data: recentUsers },
    { data: recentFarms },
    { data: recentBookings },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("farms").select("id", { count: "exact", head: true }),
    supabase.from("farms").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("booking_requests").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("page_views")
      .select("created_at, session_id")
      .gte("created_at", since14.toISOString()),
    supabase
      .from("page_views")
      .select("id, path, created_at, users(name)")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("farmer_profiles")
      .select("id, years_experience, created_at, users(name)")
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("reports")
      .select("id, target_type, target_id, reason, created_at, users(name)")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("users").select("id, name, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("farms").select("id, name, created_at").order("created_at", { ascending: false }).limit(10),
    supabase
      .from("booking_requests")
      .select("id, status, created_at, farms(name), users(name)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("products")
      .select("id, name, created_at, farms(name)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const chartDays = buildChartDays(since14);
  const dayBuckets = new Map(chartDays.map((d) => [d.date, d]));
  const daySessions = new Map<string, Set<string>>(chartDays.map((d) => [d.date, new Set<string>()]));

  const since7Iso = since7.toISOString();
  const visitors7d = new Set<string>();
  let views7d = 0;

  for (const row of windowViews ?? []) {
    const date = row.created_at.slice(0, 10);
    const bucket = dayBuckets.get(date);
    if (bucket) {
      bucket.views += 1;
      daySessions.get(date)?.add(row.session_id);
    }
    if (row.created_at >= since7Iso) {
      visitors7d.add(row.session_id);
      views7d += 1;
    }
  }

  for (const day of chartDays) {
    day.visitors = daySessions.get(day.date)?.size ?? 0;
  }

  const activity: ActivityItem[] = [
    ...(recentUsers ?? []).map((u) => ({
      type: "signup",
      label: `${u.name ?? "Someone"} joined`,
      timestamp: u.created_at as string,
    })),
    ...(recentFarms ?? []).map((f) => ({
      type: "farm",
      label: `New farm listed: ${f.name}`,
      timestamp: f.created_at as string,
    })),
    ...(recentBookings ?? []).map((b) => {
      const farmName = (b as { farms?: { name?: string } }).farms?.name ?? "a farm";
      const visitorName = (b as { users?: { name?: string } }).users?.name ?? "A visitor";
      return {
        type: "booking",
        label: `${visitorName} requested a visit to ${farmName} (${b.status})`,
        timestamp: b.created_at as string,
      };
    }),
    ...(recentProducts ?? []).map((p) => {
      const farmName = (p as { farms?: { name?: string } }).farms?.name ?? "A farm";
      return {
        type: "product",
        label: `${farmName} added product: ${p.name}`,
        timestamp: p.created_at as string,
      };
    }),
  ]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 20);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-2xl font-semibold text-green-950">Admin Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors (7d)" value={visitors7d.size} sublabel="unique sessions" />
        <StatCard label="Page Views (7d)" value={views7d} />
        <StatCard label="Total Users" value={totalUsers ?? 0} />
        <StatCard label="Farms" value={totalFarms ?? 0} sublabel={`${openFarms ?? 0} open now`} />
        <StatCard label="Booking Requests" value={totalBookings ?? 0} />
        <StatCard label="Shop Products" value={totalProducts ?? 0} />
        <StatCard label="Pending Verifications" value={pendingFarmers?.length ?? 0} />
        <StatCard label="Open Reports" value={openReports?.length ?? 0} />
      </div>

      <Card className="soil-line">
        <CardContent className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold text-green-950">
            Unique visitors — last {CHART_DAYS} days
          </h2>
          <VisitorsChart data={chartDays} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="soil-line">
          <CardContent className="flex flex-col gap-3">
            <h2 className="font-heading text-lg font-semibold text-green-950">Recent Activity</h2>
            {activity.length === 0 && <p className="text-sm text-green-600">Nothing yet.</p>}
            <ul className="flex flex-col gap-2">
              {activity.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-green-900">{item.label}</span>
                  <span className="shrink-0 text-xs text-green-500">{timeAgo(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="soil-line">
          <CardContent className="flex flex-col gap-3">
            <h2 className="font-heading text-lg font-semibold text-green-950">Recent Page Views</h2>
            {(!recentPageViews || recentPageViews.length === 0) && (
              <p className="text-sm text-green-600">No page views logged yet.</p>
            )}
            <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {recentPageViews?.map((view) => {
                const visitorName = (view as { users?: { name?: string } }).users?.name;
                return (
                  <li key={view.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-green-900">
                      {view.path}{" "}
                      <span className="text-green-500">— {visitorName ?? "Guest"}</span>
                    </span>
                    <span className="shrink-0 text-xs text-green-500">{timeAgo(view.created_at)}</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="soil-line">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold text-green-950">
            Pending Farmer Verifications
          </h2>
          {(!pendingFarmers || pendingFarmers.length === 0) && (
            <p className="text-sm text-green-600">No farmers waiting on verification.</p>
          )}
          <ul className="flex flex-col gap-3">
            {pendingFarmers?.map((farmer) => {
              const name = (farmer as { users?: { name?: string } }).users?.name ?? "Unknown";
              return (
                <li key={farmer.id} className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium text-green-950">{name}</span>
                    {farmer.years_experience != null && (
                      <span className="text-green-600"> — {farmer.years_experience} yrs experience</span>
                    )}
                  </div>
                  <form action={verifyFarmer.bind(null, farmer.id)}>
                    <Button type="submit" size="sm" className="btn-earthy soil-line font-semibold">
                      Approve
                    </Button>
                  </form>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="soil-line">
        <CardContent className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold text-green-950">Open Reports</h2>
          {(!openReports || openReports.length === 0) && (
            <p className="text-sm text-green-600">Nothing reported.</p>
          )}
          <ul className="flex flex-col gap-3">
            {openReports?.map((report) => {
              const reporterName = (report as { users?: { name?: string } }).users?.name ?? "Unknown";
              return (
                <li key={report.id} className="flex flex-col gap-2 border-b border-green-100 pb-3 last:border-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{report.target_type}</Badge>
                    <span className="text-green-600">reported by {reporterName}</span>
                  </div>
                  <p className="text-sm text-green-900">{report.reason}</p>
                  <div className="flex gap-2">
                    <form action={updateReportStatus.bind(null, report.id, "resolved")}>
                      <Button type="submit" size="sm" variant="outline">
                        Resolve
                      </Button>
                    </form>
                    <form action={updateReportStatus.bind(null, report.id, "dismissed")}>
                      <Button type="submit" size="sm" variant="ghost">
                        Dismiss
                      </Button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

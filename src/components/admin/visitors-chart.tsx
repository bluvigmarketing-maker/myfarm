export type DayStat = { date: string; label: string; visitors: number; views: number };

const CHART_HEIGHT = 130; // px — the label sits below in its own row

export function VisitorsChart({ data }: { data: DayStat[] }) {
  const max = Math.max(1, ...data.map((d) => d.visitors));

  return (
    <div className="flex items-end gap-2" style={{ height: CHART_HEIGHT + 20 }}>
      {data.map((day) => {
        const barHeight = Math.max(3, Math.round((day.visitors / max) * CHART_HEIGHT));
        return (
          <div
            key={day.date}
            className="flex flex-1 flex-col items-center justify-end gap-1"
            style={{ height: CHART_HEIGHT + 20 }}
          >
            <div
              className="w-full rounded-t-sm bg-brown-500"
              style={{ height: barHeight }}
              title={`${day.label}: ${day.visitors} visitor${day.visitors === 1 ? "" : "s"}, ${day.views} view${day.views === 1 ? "" : "s"}`}
            />
            <span className="text-[10px] text-green-600">{day.label}</span>
          </div>
        );
      })}
    </div>
  );
}

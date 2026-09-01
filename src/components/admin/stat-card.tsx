import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <Card className="soil-line">
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm font-medium text-green-700">{label}</span>
        <span className="font-heading text-3xl font-semibold text-green-950">{value}</span>
        {sublabel && <span className="text-xs text-green-600">{sublabel}</span>}
      </CardContent>
    </Card>
  );
}

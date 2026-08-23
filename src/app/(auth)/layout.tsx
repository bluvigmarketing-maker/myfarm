import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-green-50 px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/" className="font-heading text-xl font-semibold text-green-800">
          FarmVisit
        </Link>
        <Card className="soil-line w-full">
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

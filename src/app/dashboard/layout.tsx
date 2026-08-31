import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { logout } from "../(auth)/actions";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <div className="flex flex-1 flex-col bg-green-50">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <Link href="/dashboard" className="font-heading text-xl font-semibold text-green-800">
            Shamba Spot
          </Link>
          <form action={logout}>
            <Button type="submit" variant="ghost" className="text-green-800 hover:text-green-900">
              Log out
            </Button>
          </form>
        </Container>
      </header>
      <Container className="flex-1 py-10">{children}</Container>
    </div>
  );
}

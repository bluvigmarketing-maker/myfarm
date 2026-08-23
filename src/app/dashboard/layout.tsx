import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { logout } from "../(auth)/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <div className="flex flex-1 flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-green-800">
            FarmVisit
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-stone-600 hover:text-green-800">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}

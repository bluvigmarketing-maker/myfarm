import Link from "next/link";

const NAV_LINKS = [
  { href: "/farms", label: "Find a Farm" },
  { href: "/login", label: "Log in" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-green-800">
          FarmVisit
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-green-800">
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="rounded-full bg-green-800 px-4 py-2 text-white hover:bg-green-900"
          >
            List Your Farm
          </Link>
        </nav>
      </div>
    </header>
  );
}

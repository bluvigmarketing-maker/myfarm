import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-green-800">FarmVisit</span>
          <p className="max-w-xs text-sm text-stone-500">
            Learn farming the way it&apos;s always been taught: in the field.
            Discover farms open for training visits and agro-tourism.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-stone-900">Explore</span>
          <Link href="/farms" className="text-stone-600 hover:text-green-800">
            Find a Farm
          </Link>
          <Link href="/signup" className="text-stone-600 hover:text-green-800">
            List Your Farm
          </Link>
          <Link href="/login" className="text-stone-600 hover:text-green-800">
            Log in
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-stone-900">About</span>
          <span className="text-stone-600">
            Bookings and orders happen directly on WhatsApp between you and
            the farmer.
          </span>
        </div>
      </div>
      <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} FarmVisit. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-green-800">FarmVisit</span>
          <nav className="flex gap-4 text-sm font-medium text-stone-600">
            <Link href="/farms" className="hover:text-green-800">
              Find a Farm
            </Link>
            <Link href="/login" className="hover:text-green-800">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-green-800 px-4 py-2 text-white hover:bg-green-900"
            >
              List Your Farm
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Learn farming the way it&apos;s always been taught: in the field.
        </h1>
        <p className="max-w-xl text-lg text-stone-600">
          Discover experienced farmers who open their farms for training visits
          and agro-tourism. Book directly on WhatsApp, and shop farm-gate
          produce straight from the source.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/farms"
            className="rounded-full bg-green-800 px-6 py-3 font-medium text-white hover:bg-green-900"
          >
            Browse Farms
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-stone-300 px-6 py-3 font-medium text-stone-700 hover:bg-stone-100"
          >
            List Your Farm
          </Link>
        </div>
      </main>
    </div>
  );
}

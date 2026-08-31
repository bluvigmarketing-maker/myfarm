import Link from "next/link";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="bg-green-950 text-green-100">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-xl font-semibold text-white">Shamba Spot</span>
          <p className="max-w-xs text-sm text-green-200">
            Learn farming the way it&apos;s always been taught: in the field.
            Discover farms open for training visits and agro-tourism.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-brown-300">Explore</span>
          <Link href="/farms" className="text-green-200 hover:text-white">
            Find a Farm
          </Link>
          <Link href="/market" className="text-green-200 hover:text-white">
            Market
          </Link>
          <Link href="/signup" className="text-green-200 hover:text-white">
            List Your Farm
          </Link>
          <Link href="/login" className="text-green-200 hover:text-white">
            Log in
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-brown-300">About</span>
          <Link href="/about" className="text-green-200 hover:text-white">
            About Us
          </Link>
          <span className="text-green-200">
            Bookings and orders happen directly on WhatsApp between you and
            the farmer.
          </span>
        </div>
      </Container>
      <div className="border-t border-green-800 py-4 text-center text-xs text-green-400">
        © {new Date().getFullYear()} Shamba Spot. All rights reserved.
      </div>
    </footer>
  );
}

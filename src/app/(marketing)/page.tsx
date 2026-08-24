import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { HeroBackground } from "@/components/hero-background";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-[85vh] flex-1 flex-col overflow-hidden">
      <HeroBackground />
      <Container className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
        <span className="w-fit rounded-full border border-brown-400/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-300">
          Learn in the field
        </span>
        <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Learn farming the way it&apos;s always been taught: in the field.
        </h1>
        <span className="h-px w-16 bg-brown-400" />
        <p className="max-w-xl text-lg text-green-50">
          Discover experienced farmers who open their farms for training visits
          and agro-tourism. Book directly on WhatsApp, and shop farm-gate
          produce straight from the source.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="btn-earthy soil-line font-semibold"
            nativeButton={false}
            data-tour="home-browse-farms"
            render={<Link href="/farms" />}
          >
            Browse Farms
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="soil-line border-white/40 bg-white/10 text-white hover:bg-white/20"
            nativeButton={false}
            data-tour="home-list-farm"
            render={<Link href="/signup" />}
          >
            List Your Farm
          </Button>
        </div>
      </Container>
    </main>
  );
}

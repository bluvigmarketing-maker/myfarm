import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Container className="flex flex-1 flex-col items-center gap-6 py-24 text-center">
        <span className="w-fit rounded-full border border-brown-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-700">
          Learn in the field
        </span>
        <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-green-950 sm:text-5xl">
          Learn farming the way it&apos;s always been taught: in the field.
        </h1>
        <span className="h-px w-16 bg-brown-400" />
        <p className="max-w-xl text-lg text-green-700">
          Discover experienced farmers who open their farms for training visits
          and agro-tourism. Book directly on WhatsApp, and shop farm-gate
          produce straight from the source.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="btn-earthy soil-line font-semibold"
            nativeButton={false}
            render={<Link href="/farms" />}
          >
            Browse Farms
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/signup" />}>
            List Your Farm
          </Button>
        </div>
      </Container>
    </main>
  );
}

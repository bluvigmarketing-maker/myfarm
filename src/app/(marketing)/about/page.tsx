import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Find a farm",
    text: "Browse real farms — company farms, school farms, and family farms — and see what they offer.",
  },
  {
    title: "Book on WhatsApp",
    text: "Message the farmer directly to book a visit or a training day. No middleman, no app to learn.",
  },
  {
    title: "Learn in the field",
    text: "Show up, learn from someone who's done it for years, and maybe buy some fresh produce too.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        eyebrow="Our Story"
        title="Farmers teaching farmers"
        description="FarmVisit connects experienced farmers with people who want to learn — in person, on real farms."
      />

      <Container className="flex flex-col gap-12 py-12">
        <AnimatedSection className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-semibold text-green-950">Why we exist</h2>
          <p className="max-w-2xl text-green-700">
            The best farming lessons don&apos;t come from a video. They come
            from standing in a field with someone who&apos;s grown food for
            years. FarmVisit makes it easy to find those farmers, see what
            they offer, and book a visit — all without any paid apps or
            complicated tools.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-semibold text-green-950">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <Card key={step.title} className="soil-line">
                <CardContent className="flex flex-col gap-2">
                  <span className="font-heading text-2xl font-semibold text-brown-500">
                    {index + 1}
                  </span>
                  <h3 className="font-heading text-lg font-medium text-green-950">
                    {step.title}
                  </h3>
                  <p className="text-sm text-green-700">{step.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex flex-col items-center gap-4 py-6 text-center">
          <h2 className="font-heading text-2xl font-semibold text-green-950">
            Ready to get started?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="btn-earthy soil-line font-semibold" nativeButton={false} render={<Link href="/farms" />}>
              Browse Farms
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/signup" />}>
              List Your Farm
            </Button>
          </div>
        </AnimatedSection>
      </Container>
    </main>
  );
}

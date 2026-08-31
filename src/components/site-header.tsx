"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Container } from "@/components/container";

const NAV_LINKS = [
  { href: "/", label: "Home", tourId: "nav-home" },
  { href: "/farms", label: "Find a Farm", tourId: "nav-find-farm" },
  { href: "/market", label: "Market", tourId: "nav-market" },
  { href: "/about", label: "About Us", tourId: "nav-about" },
  { href: "/login", label: "Log in", tourId: "nav-login" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-heading text-xl font-semibold text-green-800">
          Shamba Spot
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-green-800/80 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-tour={link.tourId}
              className="hover:text-green-900"
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="btn-earthy soil-line font-semibold"
            nativeButton={false}
            data-tour="nav-list-farm"
            render={<Link href="/signup" />}
          >
            List Your Farm
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </Container>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Shamba Spot</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-green-800 hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4">
            <Button
              className="btn-earthy soil-line w-full font-semibold"
              nativeButton={false}
              render={<Link href="/signup" onClick={() => setOpen(false)} />}
            >
              List Your Farm
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

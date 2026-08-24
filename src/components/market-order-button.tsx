"use client";

import { Button } from "@/components/ui/button";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export function MarketOrderButton({
  farmName,
  productName,
  unit,
  whatsappNumber,
}: {
  farmName: string;
  productName: string;
  unit: string;
  whatsappNumber: string;
}) {
  function handleClick() {
    const message = buildOrderMessage({
      farmName,
      visitorName: "a visitor",
      items: [{ name: productName, qty: 1, unit }],
    });
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <Button size="sm" className="btn-earthy soil-line w-full font-semibold" onClick={handleClick}>
      Order via WhatsApp
    </Button>
  );
}

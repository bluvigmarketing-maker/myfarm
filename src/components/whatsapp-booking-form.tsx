"use client";

import { useState } from "react";
import { buildBookingMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const inputClass =
  "rounded-lg border border-green-200 px-3 py-2 outline-none focus:border-brown-500 focus:ring-2 focus:ring-brown-400/40";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-green-900";

export function WhatsAppBookingForm({
  farmName,
  whatsappNumber,
}: {
  farmName: string;
  whatsappNumber: string;
}) {
  const [visitorName, setVisitorName] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [purpose, setPurpose] = useState<"training" | "tour" | "both">("tour");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = buildBookingMessage({
      farmName,
      visitorName: visitorName || "a visitor",
      requestedDate: requestedDate || "flexible",
      numPeople,
      purpose,
      note: note || undefined,
    });
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <Card className="soil-line">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium text-green-950">Book a Visit</h2>
          <label className={labelClass}>
            Your name
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="flex gap-3">
            <label className={`flex-1 ${labelClass}`}>
              Date
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              People
              <input
                type="number"
                min={1}
                value={numPeople}
                onChange={(e) => setNumPeople(Number(e.target.value))}
                className={`w-20 ${inputClass}`}
              />
            </label>
          </div>
          <label className={labelClass}>
            Purpose
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as "training" | "tour" | "both")}
              className={inputClass}
            >
              <option value="tour">Tour</option>
              <option value="training">Training</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label className={labelClass}>
            Note (optional)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </label>
          <Button type="submit" className="btn-earthy soil-line font-semibold">
            Book via WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { buildBookingMessage, buildWhatsAppLink } from "@/lib/whatsapp";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-5">
      <h2 className="font-medium text-stone-900">Book a Visit</h2>
      <label className="flex flex-col gap-1 text-sm">
        Your name
        <input
          type="text"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2"
        />
      </label>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Date
          <input
            type="date"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          People
          <input
            type="number"
            min={1}
            value={numPeople}
            onChange={(e) => setNumPeople(Number(e.target.value))}
            className="w-20 rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Purpose
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as "training" | "tour" | "both")}
          className="rounded-md border border-stone-300 px-3 py-2"
        >
          <option value="tour">Tour</option>
          <option value="training">Training</option>
          <option value="both">Both</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Note (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="rounded-md border border-stone-300 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-green-800 px-4 py-2 font-medium text-white hover:bg-green-900"
      >
        Book via WhatsApp
      </button>
    </form>
  );
}

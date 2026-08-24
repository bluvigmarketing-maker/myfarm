"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stepsForPath, type TourPath } from "./tour-steps";

const STORAGE_KEY = "farmvisit_tour_seen";

type Mode = "hidden" | "ask" | "playing";

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore — worst case the tour reappears next visit
  }
}

function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppTour() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [path, setPath] = useState<TourPath | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!hasSeenTour()) {
      const timer = setTimeout(() => setMode("ask"), 700);
      return () => clearTimeout(timer);
    }
  }, []);

  function openTour() {
    setPath(null);
    setStepIndex(0);
    setMode("ask");
  }

  function close() {
    markSeen();
    setMode("hidden");
  }

  function choosePath(chosen: TourPath) {
    setPath(chosen);
    setStepIndex(0);
    setMode("playing");
  }

  const steps = path ? stepsForPath(path) : [];
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <>
      {mode === "hidden" && (
        <button
          type="button"
          onClick={openTour}
          aria-label="Open the FarmVisit tour"
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-brown-400/60 bg-white py-1.5 pr-4 pl-1.5 text-sm font-medium text-green-800 shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Image
            src="/goat-guide.jpg"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          Take the tour
        </button>
      )}

      <AnimatePresence>
        {mode !== "hidden" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-brown-400/60 bg-white p-6 pt-14 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close tour"
                className="absolute top-3 right-3 rounded-full p-1 text-green-600 hover:bg-green-50 hover:text-green-900"
              >
                <X className="size-4" aria-hidden="true" />
              </button>

              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/goat-guide.jpg"
                  alt="Billy the Goat"
                  width={88}
                  height={88}
                  className="size-20 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {mode === "ask" && (
                  <motion.div
                    key="ask"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <span className="w-fit rounded-full border border-brown-400/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brown-700">
                      Hi, I&apos;m Billy!
                    </span>
                    <h2 className="font-heading text-xl font-semibold text-green-950">
                      What brings you here today?
                    </h2>
                    <p className="text-sm text-green-700">
                      Pick one and I&apos;ll show you around. Easy!
                    </p>
                    <div className="flex w-full flex-col gap-2">
                      <Button
                        className="btn-earthy soil-line w-full font-semibold"
                        onClick={() => choosePath("farmer")}
                      >
                        🚜 I want to be a Model Farmer
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => choosePath("learner")}
                      >
                        🌱 I want to learn & visit farms
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-green-800"
                        onClick={() => choosePath("both")}
                      >
                        🤙 Show me both!
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="text-xs text-green-500 hover:text-green-700 hover:underline"
                    >
                      Skip the tour
                    </button>
                  </motion.div>
                )}

                {mode === "playing" && step && (
                  <motion.div
                    key={`${path}-${stepIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <h2 className="font-heading text-xl font-semibold text-green-950">
                      {step.title}
                    </h2>
                    <p className="text-sm text-green-700">{step.text}</p>

                    <div className="flex gap-1.5">
                      {steps.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-5 rounded-full ${
                            i === stepIndex ? "bg-brown-500" : "bg-green-100"
                          }`}
                        />
                      ))}
                    </div>

                    {step.ctas && (
                      <div className="flex w-full flex-col gap-2">
                        {step.ctas.map((cta) => (
                          <Button
                            key={cta.href}
                            className="btn-earthy soil-line w-full font-semibold"
                            nativeButton={false}
                            render={<Link href={cta.href} onClick={close} />}
                          >
                            {cta.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="flex w-full items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setMode("ask")}
                        className="text-xs text-green-500 hover:text-green-700 hover:underline"
                      >
                        {stepIndex === 0 ? "Back to start" : "Restart"}
                      </button>
                      <div className="flex gap-2">
                        {stepIndex > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStepIndex((i) => i - 1)}
                          >
                            Back
                          </Button>
                        )}
                        {!isLastStep && (
                          <Button
                            size="sm"
                            className="btn-earthy soil-line font-semibold"
                            onClick={() => setStepIndex((i) => i + 1)}
                          >
                            Next
                          </Button>
                        )}
                        {isLastStep && (
                          <Button variant="outline" size="sm" onClick={close}>
                            Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stepsForPath, type TourPath } from "./tour-steps";

const STORAGE_KEY = "farmvisit_tour_seen";
const SPOTLIGHT_PADDING = 8;

type Mode = "hidden" | "ask" | "playing";
type Rect = { top: number; left: number; width: number; height: number };

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
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<Mode>("hidden");
  const [path, setPath] = useState<TourPath | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const steps = path ? stepsForPath(path) : [];
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!hasSeenTour()) {
      const timer = setTimeout(() => setMode("ask"), 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Jump to the page a step is about, if we're not already there.
  useEffect(() => {
    if (mode !== "playing" || !step?.navigateTo) return;
    if (pathname !== step.navigateTo) {
      router.push(step.navigateTo);
    }
  }, [mode, path, stepIndex, pathname, router, step?.navigateTo]);

  // Find and track the real element this step is talking about.
  useEffect(() => {
    if (mode !== "playing" || !step?.highlight) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let scrolledIntoView = false;

    function measure() {
      const el = document.querySelector(`[data-tour="${step!.highlight}"]`);
      if (!el) return false;
      if (!scrolledIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        scrolledIntoView = true;
      }
      const r = el.getBoundingClientRect();
      if (!cancelled) {
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
      return true;
    }

    const interval = setInterval(() => {
      attempts += 1;
      if (measure() || attempts > 20) clearInterval(interval);
    }, 100);

    const onViewportChange = () => measure();
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, path, stepIndex, pathname]);

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

  const spotlight = rect && step?.highlight
    ? {
        top: Math.max(rect.top - SPOTLIGHT_PADDING, 0),
        left: Math.max(rect.left - SPOTLIGHT_PADDING, 0),
        width: rect.width + SPOTLIGHT_PADDING * 2,
        height: rect.height + SPOTLIGHT_PADDING * 2,
      }
    : null;

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
          <div className="fixed inset-0 z-50">
            {spotlight ? (
              <>
                <div
                  onClick={close}
                  className="fixed bg-green-950/55 backdrop-blur-sm"
                  style={{ top: 0, left: 0, width: "100%", height: spotlight.top }}
                />
                <div
                  onClick={close}
                  className="fixed bg-green-950/55 backdrop-blur-sm"
                  style={{
                    top: spotlight.top + spotlight.height,
                    left: 0,
                    width: "100%",
                    height: `calc(100vh - ${spotlight.top + spotlight.height}px)`,
                  }}
                />
                <div
                  onClick={close}
                  className="fixed bg-green-950/55 backdrop-blur-sm"
                  style={{ top: spotlight.top, left: 0, width: spotlight.left, height: spotlight.height }}
                />
                <div
                  onClick={close}
                  className="fixed bg-green-950/55 backdrop-blur-sm"
                  style={{
                    top: spotlight.top,
                    left: spotlight.left + spotlight.width,
                    width: `calc(100vw - ${spotlight.left + spotlight.width}px)`,
                    height: spotlight.height,
                  }}
                />
                <motion.div
                  className="pointer-events-none fixed rounded-2xl ring-4 ring-brown-400"
                  style={{
                    top: spotlight.top,
                    left: spotlight.left,
                    width: spotlight.width,
                    height: spotlight.height,
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 0px 4px rgba(179,131,90,0.5)",
                      "0 0 22px 6px rgba(179,131,90,0.85)",
                      "0 0 0px 4px rgba(179,131,90,0.5)",
                    ],
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            ) : (
              <motion.div
                className="fixed inset-0 bg-green-950/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              />
            )}

            <div className="pointer-events-none fixed inset-0 flex items-center justify-center px-4">
              <motion.div
                className="pointer-events-auto relative w-full max-w-sm rounded-3xl border border-brown-400/60 bg-white p-6 pt-14 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 16 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
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
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

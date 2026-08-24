"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const LANDSCAPE_IMAGES = [
  "/hero/landscape-1.png",
  "/hero/landscape-2.png",
  "/hero/landscape-3.png",
  "/hero/landscape-4.png",
  "/hero/landscape-5.png",
];

const PORTRAIT_IMAGES = [
  "/hero/portrait-1.png",
  "/hero/portrait-2.png",
  "/hero/portrait-3.png",
  "/hero/portrait-4.png",
  "/hero/portrait-5.png",
];

const SLIDE_DURATION_MS = 7000;
const FADE_DURATION_S = 1.6;

function pickImageSet() {
  const isSmallOrPortrait = window.innerWidth < 768 || window.innerHeight > window.innerWidth;
  return isSmallOrPortrait ? PORTRAIT_IMAGES : LANDSCAPE_IMAGES;
}

export function HeroBackground() {
  const [images, setImages] = useState<string[]>(LANDSCAPE_IMAGES);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const onResize = () => setImages(pickImageSet());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [images.length, reducedMotion]);

  const current = images[index % images.length];

  return (
    <div className="absolute inset-0 overflow-hidden bg-green-950">
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : FADE_DURATION_S, ease: "easeInOut" }}
        >
          <Image src={current} alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Balanced dark overlay: readable everywhere without flattening the photo. */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-green-950/25" />
    </div>
  );
}

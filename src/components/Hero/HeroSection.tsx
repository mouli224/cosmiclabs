"use client";

import { motion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import DotInfinity from "./DotInfinity";
import CosmicLabsLogo from "@/components/shared/CosmicLabsLogo";

// Lazy load Three.js canvas — only on client, no SSR
const CosmicSpheres = dynamic(() => import("./CosmicSpheres"), {
  ssr: false,
  loading: () => null,
});

// ─── Stagger variants ────────────────────────────────────────
const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Scroll Indicator (infinity-shaped bounce) ──────────────
function ScrollIndicator() {
  const scrollNext = () => {
    const lenis = (window as unknown as Record<string, unknown>).__lenis as {
      scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void;
    } | undefined;
    if (lenis) lenis.scrollTo("#what-we-do", { offset: -80, duration: 1.2 });
    else document.getElementById("what-we-do")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.8 }}
      onClick={scrollNext}
    >
      {/* Mark-only logo as scroll hint — matches brand identity */}
      <CosmicLabsLogo variant="mark" height={16} color="rgba(255,255,255,0.35)" />
      <motion.div
        className="text-white/30 text-[10px] tracking-[0.25em] uppercase"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll
      </motion.div>
    </motion.div>
  );
}

// ─── Main Hero Section ──────────────────────────────────────
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Three.js floating spheres background */}
      <CosmicSpheres count={28} />

      {/* Radial gradient focal glow at centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Dot-assembly infinity — builds the ∞ shape dot by dot */}
        <motion.div variants={item} className="mb-8">
          <DotInfinity
            size={72}
            dotCount={80}
            dotRadius={0.07}
            stagger={0.024}
            initialDelay={0.2}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="display-text glow-text text-white text-[clamp(2.4rem,8vw,6rem)] mb-6 max-w-3xl"
        >
          We Build{" "}
          <span className="font-light text-white/70">Infinite Digital</span>
          <br />
          Possibilities.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={item}
          className="text-white/50 text-[clamp(0.9rem,2vw,1.15rem)] font-light max-w-xl leading-relaxed mb-4"
        >
          Web &middot; AI &middot; Data &middot; Precision Engineering
        </motion.p>
        <motion.p
          variants={item}
          className="text-white/35 text-sm font-light max-w-lg leading-relaxed"
        >
          We don&apos;t just build products — we architect scalable digital
          universes. Every system we ship is designed to compound over time.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="mt-10">
          <button
            onClick={() => {
              const lenis = (window as unknown as Record<string, unknown>).__lenis as {
                scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void;
              } | undefined;
              if (lenis) lenis.scrollTo("#build-with-us", { offset: -80, duration: 1.4 });
              else document.getElementById("build-with-us")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative group px-8 py-3.5 text-sm tracking-wider text-white border border-white/20 hover:border-white/60 transition-all duration-500 rounded-none overflow-hidden"
          >
            {/* Hover fill animation */}
            <span
              className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
            />
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              Start a Project
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom fade-out gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Reuse CosmicSpheres as a subtle behind-text background
const CosmicSpheres = dynamic(() => import("@/components/Hero/CosmicSpheres"), {
  ssr: false,
  loading: () => null,
});

// ─── Manifesto lines with individual stagger ────────────────
const MANIFESTO = [
  { text: "We are cosmic nerds.", weight: "font-bold" },
  { text: "Obsessed with building galaxies inside the web.", weight: "font-light" },
  { text: "We experiment.", weight: "font-bold" },
  { text: "We engineer.", weight: "font-bold" },
  { text: "We scale ideas beyond gravity.", weight: "font-light" },
];

const STATS = [
  { value: "4+", label: "Years Building" },
  { value: "20+", label: "Projects Shipped" },
  { value: "∞", label: "Possibilities" },
];

// ─── Section ─────────────────────────────────────────────────
export default function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10%" });

  const manifestoRef = useRef<HTMLDivElement>(null);
  const manifestoInView = useInView(manifestoRef, {
    once: true,
    margin: "-5%",
  });

  // Parallax for the background spheres
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sphereY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      id="who-we-are"
      ref={sectionRef}
      className="relative py-28 md:py-48 bg-black overflow-hidden"
    >
      {/* Faint sphere layer behind content */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ y: sphereY }}
      >
        <CosmicSpheres count={14} />
      </motion.div>

      {/* Deep radial gradient to keep text readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 80%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        {/* Label */}
        <motion.div
          ref={titleRef}
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">
            About
          </p>
          <h2 className="display-text text-white text-[clamp(2rem,5vw,3.8rem)]">
            Who We Are
          </h2>
        </motion.div>

        {/* Manifesto typography block */}
        <div
          ref={manifestoRef}
          className="mb-20 md:mb-28"
        >
          {MANIFESTO.map((line, i) => (
            <motion.p
              key={i}
              className={`text-[clamp(1.5rem,4.5vw,3.2rem)] ${line.weight} leading-[1.1] tracking-tight mb-2 md:mb-3`}
              style={{
                color:
                  line.weight === "font-bold"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={manifestoInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="w-12 h-px bg-white/20 mb-16 md:mb-20"
          initial={{ scaleX: 0 }}
          animate={manifestoInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-1 glow-text">
                {value}
              </p>
              <p className="text-white/35 text-xs tracking-wider uppercase">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

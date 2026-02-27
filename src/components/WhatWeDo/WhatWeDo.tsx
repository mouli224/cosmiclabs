"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Service card data ───────────────────────────────────────
const SERVICES = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Modern scalable architectures. We craft high-performance web platforms built for millions — Next.js, React, edge-deployed, CDN-optimized.",
    tags: ["Next.js", "TypeScript", "Edge"],
  },
  {
    number: "02",
    title: "App Development",
    description:
      "Cross-platform & native experiences. Fast, delightful mobile apps that users actually keep. React Native, Flutter, iOS & Android.",
    tags: ["React Native", "Flutter", "iOS / Android"],
  },
  {
    number: "03",
    title: "AI Integrations",
    description:
      "LLMs, agents & intelligent automation systems. We integrate OpenAI, Claude, Gemini and custom models into production-grade workflows.",
    tags: ["LLMs", "RAG", "Agents"],
  },
  {
    number: "04",
    title: "End-to-End Data Pipelines",
    description:
      "ETL, analytics & cloud-scale data infrastructure. From raw ingestion to business dashboards — we build data systems that scale to petabytes.",
    tags: ["ETL", "Analytics", "Cloud"],
  },
];

// ─── Infinity line that appears on hover ────────────────────
function InfinityAccent({ visible }: { visible: boolean }) {
  // Same single-stroke lemniscate path, normalised to a small viewBox
  const d =
    "M 3.5,0 " +
    "C 3.5,1.45 0.55,1.45 0,0 " +
    "C -0.55,-1.45 -3.5,-1.45 -3.5,0 " +
    "C -3.5,1.45 -0.55,1.45 0,0 " +
    "C 0.55,-1.45 3.5,-1.45 3.5,0";
  return (
    <svg
      width="60"
      height="28"
      viewBox="-4 -2 8 4"
      fill="none"
      className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

// ─── Individual service card ─────────────────────────────────
function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative group glass-card card-hover-glow p-8 rounded-sm cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number */}
      <span className="text-white/15 text-xs tracking-[0.25em] font-light mb-5 block">
        {service.number}
      </span>

      {/* Title */}
      <h3 className="text-white text-xl font-semibold mb-3 tracking-tight">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-white/45 text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="text-white/30 text-[11px] tracking-wider border border-white/10 px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Infinity accent — draws in on hover */}
      <InfinityAccent visible={hovered} />

      {/* Top-left subtle corner accent */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15 group-hover:border-white/40 transition-colors duration-500" />
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────
export default function WhatWeDo() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10%" });

  return (
    <section
      id="what-we-do"
      className="relative py-28 md:py-40 bg-black overflow-hidden"
    >
      {/* Faint horizontal divider at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">
            Services
          </p>
          <h2 className="display-text text-white text-[clamp(2rem,5vw,3.8rem)]">
            What We Do
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

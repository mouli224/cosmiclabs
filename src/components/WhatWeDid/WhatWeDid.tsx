"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Project data ────────────────────────────────────────────
const PROJECTS = [
  {
    title: "PrintBox 3D",
    url: "https://www.printbox3d.com",
    displayUrl: "printbox3d.com",
    description:
      "A next-generation 3D printing platform connecting makers with on-demand manufacturing. Custom ordering flows, real-time quoting engine.",
    category: "Web Platform",
    year: "2024",
    confidential: false,
  },
  {
    title: "ThreeAI",
    url: "https://www.threeai.live",
    displayUrl: "threeai.live",
    description:
      "Real-time AI collaboration platform. Multi-agent orchestration, live session streaming, and embedded LLM workflows.",
    category: "AI Product",
    year: "2024",
    confidential: false,
  },
  {
    title: "CosmicLabs.online",
    url: "https://www.cosmiclabs.online",
    displayUrl: "cosmiclabs.online",
    description:
      "Our own studio portal. The digital face of CosmicLabs — minimalistic, performant, and infinitely scalable.",
    category: "Studio",
    year: "2024",
    confidential: false,
  },
  {
    title: "Mouli Portfolio",
    url: "https://www.mouliportfolio.info",
    displayUrl: "mouliportfolio.info",
    description:
      "Premium personal portfolio showcasing engineering work, case studies, and thought leadership.",
    category: "Portfolio",
    year: "2024",
    confidential: false,
  },
  {
    title: "3D AR Viewer",
    url: "https://3d-ar-tan.vercel.app",
    displayUrl: "3d-ar-tan.vercel.app",
    description:
      "Browser-native augmented reality experience with interactive 3D model rendering. Upload .glb/.gltf files, zero backend — everything runs on-device.",
    category: "AR / 3D",
    year: "2025",
    confidential: false,
  },
  {
    title: "Confidential Client Projects",
    url: null,
    displayUrl: null,
    description:
      "Enterprise-grade platforms, internal tooling, and AI systems built for clients across fintech, healthtech, and SaaS. We keep them secured & confidential.",
    category: "Various",
    year: "Ongoing",
    confidential: true,
  },
];

// ─── External link icon ──────────────────────────────────────
function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ─── Lock icon for confidential projects ────────────────────
function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/30"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Individual project card ─────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  const CardWrapper = project.url ? "a" : "div";
  const linkProps = project.url
    ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <CardWrapper
        {...linkProps}
        className={`group portfolio-card block p-7 rounded-sm relative overflow-hidden ${
          project.confidential ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {/* Top row: category + year */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/25 text-[10px] tracking-[0.25em] uppercase">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white/25 text-[10px]">{project.year}</span>
            {project.confidential ? <LockIcon /> : <ExternalLinkIcon />}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white text-lg font-semibold mb-2 tracking-tight group-hover:text-white/90 transition-colors">
          {project.title}
        </h3>

        {/* URL */}
        {project.displayUrl && (
          <p className="text-white/30 text-xs mb-4 font-mono">
            ↗ {project.displayUrl}
          </p>
        )}

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Hover corner glint */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-white/0 group-hover:border-r-white/5 transition-all duration-500" />

        {/* Bottom line that expands on hover */}
        <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </CardWrapper>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────
export default function WhatWeDid() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10%" });

  return (
    <section
      id="what-we-did"
      className="relative py-28 md:py-40 bg-black overflow-hidden"
    >
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
            Portfolio
          </p>
          <h2 className="display-text text-white text-[clamp(2rem,5vw,3.8rem)]">
            What We Did
          </h2>
        </motion.div>

        {/* Grid: 5 → first 2 wide, last 3 in row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {PROJECTS.map((project, i) => (
            <div
              key={project.title}
              className={
                i < 2 && PROJECTS.length > 3
                  ? "md:col-span-1 xl:col-span-1"
                  : ""
              }
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

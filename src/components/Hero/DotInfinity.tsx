"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface DotInfinityProps {
  /** Outer height in px — width = 2× height */
  size?: number;
  /** Total number of dots that form the ∞ shape */
  dotCount?: number;
  /** Radius of each dot in SVG userspace */
  dotRadius?: number;
  /** Delay between each dot appearing (seconds) */
  stagger?: number;
  /** Initial delay before the first dot appears (seconds) */
  initialDelay?: number;
  className?: string;
}

/**
 * DotInfinity
 * ──────────────────────────────────────────────────────────────
 * Assembles the ∞ shape by placing dots one-by-one along the
 * Bernoulli lemniscate using its exact parametric formula.
 *
 * Animation phases:
 *  1. Assembly  — dots pop in sequentially (scale 0→1, opacity 0→1)
 *                 each staggered by `stagger` seconds
 *  2. Idle glow — after assembly, a single "head" dot continuously
 *                 travels the path (brighter, slightly larger) while
 *                 the base dots breathe at very low opacity
 *
 * Math:
 *   Bernoulli lemniscate centred at origin, parameter t ∈ [0, 2π)
 *   x(t) = a·cos(t) / (1 + sin²(t))
 *   y(t) = a·sin(t)·cos(t) / (1 + sin²(t))
 *   where a = 3.5 (right extreme of the shape)
 *
 * The dots are uniformly sampled in t which naturally clusters them
 * more densely near the crossing point and the outer extremes —
 * exactly mimicking the visual weight of the reference logo.
 */

// ─── Parametric helpers ────────────────────────────────────
const A = 3.5; // semi-axis — matches InfinitySymbol path extents

function lemniscatePoint(t: number): { x: number; y: number } {
  const sin_t = Math.sin(t);
  const denom = 1 + sin_t * sin_t;
  return {
    x: (A * Math.cos(t)) / denom,
    y: (A * sin_t * Math.cos(t)) / denom,
  };
}

// ─── Component ─────────────────────────────────────────────
export default function DotInfinity({
  size = 120,
  dotCount = 72,
  dotRadius = 0.065,
  stagger = 0.028,
  initialDelay = 0.4,
  className = "",
}: DotInfinityProps) {
  const width = size * 2;
  const height = size;

  // Pre-compute all dot positions once
  const dots = useMemo(() => {
    return Array.from({ length: dotCount }, (_, i) => {
      const t = (i / dotCount) * 2 * Math.PI;
      return lemniscatePoint(t);
    });
  }, [dotCount]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="-4 -2 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CosmicLabs infinity symbol"
    >
      {/* ── Base dots — assemble one by one ──────────────── */}
      {dots.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={dotRadius}
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.9, 0.45],
            scale: [0, 1.4, 1],
          }}
          transition={{
            // Each stage timed individually
            opacity: {
              times: [0, 0.3, 1],
              duration: 0.5,
              delay: initialDelay + i * stagger,
              ease: "easeOut",
            },
            scale: {
              times: [0, 0.4, 1],
              duration: 0.5,
              delay: initialDelay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          style={{
            // Tiny glow on each dot
            filter: "drop-shadow(0 0 0.08px rgba(255,255,255,0.8))",
            originX: `${pt.x}px`,
            originY: `${pt.y}px`,
          }}
        />
      ))}

    </svg>
  );
}

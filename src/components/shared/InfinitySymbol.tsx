"use client";

import { motion } from "framer-motion";

interface InfinitySymbolProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
  className?: string;
  /** How long (seconds) one full revolution takes */
  duration?: number;
  /** 0–1: what fraction of the path is lit at any moment (trail length) */
  trailLength?: number;
}

/**
 * High-fidelity infinity / lemniscate symbol.
 *
 * Path design:
 *   - Starts at the rightmost extreme (3.5, 0)
 *   - Sweeps through both lobes in a single, unbroken cubic-bezier stroke
 *   - viewBox: -4 -2 8 4  (8 wide, 4 tall, centred at 0,0)
 *
 * Animation:
 *   - Base dim track always visible
 *   - Short glowing "comet" dash that travels the full path on repeat
 *   - Uses SVG pathLength="1" normalisation so dasharray is 0–1 regardless
 *     of the actual path length — no magic numbers needed
 */
export default function InfinitySymbol({
  size = 120,
  strokeWidth = 2,
  color = "white",
  animated = true,
  className = "",
  duration = 3.5,
  trailLength = 0.13,
}: InfinitySymbolProps) {
  // ─── Single-stroke lemniscate, starting at right extreme ──────────
  // The path traces: right-lobe bottom → cross centre → left extreme →
  // left-lobe top → cross centre → right-lobe top → back to start.
  // Control points tuned to produce equal-looking lobes with a natural
  // "crossing" pinch at the centre, matching the provided logo.
  const d =
    "M 3.5,0 " +
    "C 3.5,1.45 0.55,1.45 0,0 " +     // right lobe bottom half
    "C -0.55,-1.45 -3.5,-1.45 -3.5,0 " + // into left lobe top half
    "C -3.5,1.45 -0.55,1.45 0,0 " +    // left lobe bottom half
    "C 0.55,-1.45 3.5,-1.45 3.5,0";    // right lobe top half → close

  // viewBox: x=-4 y=-2 w=8 h=4
  const vbX = -4, vbY = -2, vbW = 8, vbH = 4;
  const height = size;
  const width = (size * vbW) / vbH; // 2× wider than tall

  const gap = 1 - trailLength; // dark portion

  if (!animated) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d={d}
          stroke={color}
          strokeWidth={strokeWidth / 28} // scale to viewBox
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    );
  }

  const sw = strokeWidth / 28; // viewBox-relative stroke width

  return (
    <svg
      width={width}
      height={height}
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* ── Dim base track ─────────────────────────────────── */}
      <path
        d={d}
        stroke={color}
        strokeWidth={sw * 0.55}
        strokeLinecap="round"
        pathLength={1}
        opacity={0.12}
      />

      {/* ── Glowing comet trail ──────────────────────────────
          pathLength="1" makes strokeDasharray work in 0–1 units.
          Animating strokeDashoffset from 0 → -1 drives the dot
          continuously around the full path.
      ────────────────────────────────────────────────────── */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={`${trailLength} ${gap}`}
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -1 }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          filter: `drop-shadow(0 0 ${sw * 8}px ${color}) drop-shadow(0 0 ${sw * 3}px ${color})`,
        }}
      />
    </svg>
  );
}


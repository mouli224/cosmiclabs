"use client";

/**
 * CosmicLabsLogo
 * ─────────────────────────────────────────────────────────────
 * Faithful SVG recreation of the CosmicLabs logo from the brand image.
 *
 * The infinity mark:
 *   - Two equal, rounded lobes with a tight pinch at the crossing
 *   - Thick rounded-cap stroke, no fill — exactly like the reference image
 *   - Centred in its own viewBox so it scales cleanly
 *
 * Variants:
 *   "horizontal"  →  [∞] CosmicLabs   (for Navbar)
 *   "stacked"     →  ∞ above / CosmicLabs below  (for full-page contexts)
 *   "mark"        →  ∞ symbol only
 */

export type LogoVariant = "horizontal" | "stacked" | "mark";

interface CosmicLabsLogoProps {
  variant?: LogoVariant;
  /** Height in px — width auto-calculated from aspect ratio */
  height?: number;
  color?: string;
  className?: string;
}

// ─── Shared lemniscate path ────────────────────────────────
// Cubic bezier tracing both lobes in a single stroke.
// Centred at (0,0), right lobe to +43, left lobe to -43.
// viewBox: -50 -25 100 50  →  100 × 50 userspace
const MARK_PATH =
  "M 0,0 " +
  "C 7,-20 43,-20 43,0 " +    // right lobe top
  "C 43,20 7,20 0,0 " +        // right lobe bottom → back to cross
  "C -7,-20 -43,-20 -43,0 " +  // left lobe top
  "C -43,20 -7,20 0,0";         // left lobe bottom → back to cross

export default function CosmicLabsLogo({
  variant = "horizontal",
  height = 36,
  color = "white",
  className = "",
}: CosmicLabsLogoProps) {
  // ── mark-only ────────────────────────────────────────────
  if (variant === "mark") {
    const w = height * 2;
    const h = height;
    return (
      <svg
        width={w}
        height={h}
        viewBox="-50 -25 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="CosmicLabs"
      >
        <path
          d={MARK_PATH}
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // ── horizontal: [mark]  Cosmic Labs ──────────────────────
  if (variant === "horizontal") {
    // Symbol occupies left third, text is inline SVG on the right
    const markH = height;
    const markW = markH * 2;
    const fontSize = markH * 0.52;
    const totalW = markW + markH * 3.8; // room for text
    const midY = markH / 2;

    return (
      <svg
        width={totalW}
        height={markH}
        viewBox={`0 0 ${totalW} ${markH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="CosmicLabs"
      >
        {/* ∞ mark — centred in its own zone */}
        <g transform={`translate(${markH}, ${midY}) scale(${markH / 50})`}>
          <path
            d={MARK_PATH}
            stroke={color}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Wordmark */}
        <text
          x={markW + markH * 0.55}
          y={midY + fontSize * 0.36}
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize={fontSize}
          fill={color}
        >
          <tspan fontWeight="700" letterSpacing="-0.02em">Cosmic</tspan>
          <tspan fontWeight="300" opacity="0.65">Labs</tspan>
        </text>
      </svg>
    );
  }

  // ── stacked: mark on top, wordmark below ─────────────────
  const markH = height * 0.55;
  const markW = markH * 2;
  const gap = height * 0.12;
  const fontSize = height * 0.26;
  const textY = markH + gap + fontSize * 0.85;
  const totalH = textY + fontSize * 0.15;
  const textW = fontSize * 7.2; // approx width of "CosmicLabs"
  const totalW = Math.max(markW + 10, textW);
  const markX = totalW / 2;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CosmicLabs"
    >
      {/* ∞ mark centred */}
      <g transform={`translate(${markX}, ${markH / 2}) scale(${markH / 50})`}>
        <path
          d={MARK_PATH}
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Wordmark centred below */}
      <text
        x={totalW / 2}
        y={textY}
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize={fontSize}
        fill={color}
      >
        <tspan fontWeight="700" letterSpacing="-0.02em">Cosmic</tspan>
        <tspan fontWeight="300" opacity="0.65">Labs</tspan>
      </text>
    </svg>
  );
}

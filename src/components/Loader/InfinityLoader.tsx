"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen loader that displays an animated infinity symbol.
 * Automatically hides after `duration` ms, then fades out.
 * Passes `onComplete` callback so parent can unmount it cleanly.
 */
interface InfinityLoaderProps {
  onComplete?: () => void;
  duration?: number; // ms before starting exit
}

export default function InfinityLoader({
  onComplete,
  duration = 2400,
}: InfinityLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // Clean single-stroke lemniscate — same path as InfinitySymbol for consistency.
  // Starts at right extreme (3.5, 0), sweeps both lobes, returns to start.
  const infinityPath =
    "M 3.5,0 " +
    "C 3.5,1.45 0.55,1.45 0,0 " +
    "C -0.55,-1.45 -3.5,-1.45 -3.5,0 " +
    "C -3.5,1.45 -0.55,1.45 0,0 " +
    "C 0.55,-1.45 3.5,-1.45 3.5,0";

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="loader"
          className="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Background subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 40% 20% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          <div className="flex flex-col items-center gap-8">
            {/* Infinity SVG — viewBox matches InfinitySymbol component */}
            <svg
              width="220"
              height="88"
              viewBox="-4 -2 8 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dim base track */}
              <path
                d={infinityPath}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.12"
                strokeLinecap="round"
              />
              {/* Glowing comet: 14% lit trail, 86% dark gap */}
              <motion.path
                d={infinityPath}
                stroke="white"
                strokeWidth="0.12"
                strokeLinecap="round"
                fill="none"
                pathLength={1}
                strokeDasharray="0.14 0.86"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -1 }}
                transition={{
                  duration: 2.2,
                  ease: "linear",
                  repeat: Infinity,
                }}
                style={{
                  filter:
                    "drop-shadow(0 0 0.06px white) drop-shadow(0 0 0.02px white)",
                }}
              />
            </svg>

            {/* Studio name fade-in */}
            <motion.p
              className="text-white/40 text-xs tracking-[0.3em] uppercase font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              CosmicLabs
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

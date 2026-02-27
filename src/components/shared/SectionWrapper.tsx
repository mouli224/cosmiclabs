"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  /** delay before animation starts */
  delay?: number;
  /** direction to reveal from */
  direction?: "up" | "down" | "left" | "right" | "none";
  id?: string;
}

/**
 * Scroll-reveal wrapper using Framer Motion's useInView hook.
 * Wraps content in a motion.div that fades + slides into view once.
 */
export default function SectionWrapper({
  children,
  className = "",
  delay = 0,
  direction = "up",
  id,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

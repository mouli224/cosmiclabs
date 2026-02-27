"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotInfinity from "@/components/Hero/DotInfinity";

const NAV_ITEMS = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Who We Are", href: "#who-we-are" },
  { label: "What We Did", href: "#what-we-did" },
  { label: "Build With Us", href: "#build-with-us" },
];

/**
 * Fixed navbar that:
 * - Is transparent + blurred at top of page.
 * - Transitions to solid black when user scrolls > 60px.
 * - Mobile hamburger that slides a full-screen menu.
 * - Hover underline uses an SVG infinity curve instead of a plain line.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    // Use Lenis scrollTo if available, fall back to native smooth scroll
    const lenis = (window as unknown as Record<string, unknown>).__lenis as {
      scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void;
    } | undefined;
    if (lenis) {
      lenis.scrollTo(href, { offset: -80, duration: 1.2 });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex items-center justify-between px-6 py-4 md:px-12"
          animate={{
            backgroundColor: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            borderBottom: scrolled
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid transparent",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Logo */}
          <button
            onClick={() => {
              const lenis = (window as unknown as Record<string, unknown>).__lenis as {
                scrollTo: (target: number | string, opts?: Record<string, unknown>) => void;
              } | undefined;
              if (lenis) lenis.scrollTo(0, { duration: 1.2 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 group"
          >
            <DotInfinity size={22} dotCount={60} dotRadius={0.08} stagger={0.01} initialDelay={2.7} />
            <span className="text-white text-sm tracking-wide leading-none select-none">
              <span className="font-bold">Cosmic</span>
              <span className="font-light opacity-70">Labs</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300 pb-1"
                >
                  {item.label}
                  {/* Animated underline — infinity curve style */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.span
                        className="absolute -bottom-0.5 left-0 right-0 block"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left center" }}
                      >
                        <svg
                          height="3"
                          viewBox="0 0 100 3"
                          preserveAspectRatio="none"
                          className="w-full"
                        >
                          <path
                            d="M 0 1.5 C 10 0, 30 3, 50 1.5 C 70 0, 90 3, 100 1.5"
                            stroke="white"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.8"
                          />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-px bg-white"
              animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-px bg-white"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-px bg-white"
              animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-white/70 hover:text-white text-2xl font-light tracking-widest transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

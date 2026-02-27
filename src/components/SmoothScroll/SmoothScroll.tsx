"use client";

import { useEffect } from "react";

/**
 * SmoothScroll — wraps the app with Lenis for buttery smooth native-feel
 * scrolling. Lenis is imported dynamically inside useEffect so it NEVER
 * runs during SSR / static generation (avoids "window is not defined" errors).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Dynamic import keeps Lenis out of the SSR bundle entirely
    let rafId: number;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        smoothWheel: true,
      });

      lenisInstance = lenis;

      // Expose globally so nav scroll helpers can call lenis.scrollTo
      (window as unknown as Record<string, unknown>).__lenis = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

    // Cleanup on unmount — runs synchronously so we cancel whatever was started
    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  return <>{children}</>;
}

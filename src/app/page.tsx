"use client";

import { useState } from "react";

// Components
import InfinityLoader from "@/components/Loader/InfinityLoader";
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/Hero/HeroSection";
import WhatWeDo from "@/components/WhatWeDo/WhatWeDo";
import WhatWeDid from "@/components/WhatWeDid/WhatWeDid";
import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import BuildWithUs from "@/components/BuildWithUs/BuildWithUs";
import Cooper from "@/components/Cooper/Cooper";

/**
 * Root page component.
 * 1. Shows the InfinityLoader on first mount.
 * 2. Once the loader exits, renders the full site.
 */
export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      {/* ─── Loading screen ─── */}
      <InfinityLoader
        duration={2200}
        onComplete={() => setLoaderDone(true)}
      />

      {/* ─── Site content (rendered underneath, revealed on loader exit) ─── */}
      {/* We render the main content always but keep it transparent until
          the loader has completed, so Three.js can initialise in the bg */}
      <main
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <Navbar />
        <HeroSection />
        <WhatWeDo />
        <WhoWeAre />
        <WhatWeDid />
        <BuildWithUs />
      </main>

      {/* Cooper — AI chatbot (always visible above everything) */}
      {loaderDone && <Cooper />}
    </>
  );
}

"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Single sphere instance ──────────────────────────────────
interface SphereProps {
  position: [number, number, number];
  radius: number;
  speed: number;
  phaseX: number;
  phaseY: number;
  phaseZ: number;
  amplitude: number;
  opacity: number;
}

function FloatingSphere({
  position,
  radius,
  speed,
  phaseX,
  phaseY,
  phaseZ,
  amplitude,
  opacity,
}: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const origin = useMemo(() => new THREE.Vector3(...position), [position]);

  // Each sphere floats on a unique sinusoidal path — feels organic, not particle-overloaded
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.position.set(
      origin.x + Math.sin(t + phaseX) * amplitude,
      origin.y + Math.cos(t * 0.7 + phaseY) * amplitude * 0.8,
      origin.z + Math.sin(t * 0.5 + phaseZ) * amplitude * 0.5
    );
    // Very subtle self-rotation
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={opacity}
        roughness={0.1}
        metalness={0.6}
        wireframe={false}
      />
    </mesh>
  );
}

// ─── Scene: populates N spheres with deterministic pseudo-random positions ──
function CosmicScene({ count = 28 }: { count?: number }) {
  // Deterministic sphere data so SSR/hydration is stable
  const spheres = useMemo<SphereProps[]>(() => {
    // Simple seeded pseudo-random
    const seeded = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => {
      const s = (n: number) => seeded(i * 17 + n);
      return {
        position: [
          (s(1) - 0.5) * 18,
          (s(2) - 0.5) * 12,
          (s(3) - 0.5) * 8 - 2,
        ] as [number, number, number],
        radius: 0.05 + s(4) * 0.18,
        speed: 0.2 + s(5) * 0.35,
        phaseX: s(6) * Math.PI * 2,
        phaseY: s(7) * Math.PI * 2,
        phaseZ: s(8) * Math.PI * 2,
        amplitude: 0.3 + s(9) * 0.8,
        opacity: 0.08 + s(10) * 0.25,
      };
    });
  }, [count]);

  return (
    <>
      {/* Minimal ambient + single directional light for soft reflections */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#ffffff" />

      {spheres.map((props, i) => (
        <FloatingSphere key={i} {...props} />
      ))}
    </>
  );
}

// ─── Public component exported to Hero ──────────────────────
interface CosmicSpheresProps {
  /** Number of floating spheres (keep low for performance) */
  count?: number;
  className?: string;
}

export default function CosmicSpheres({ count = 28, className = "" }: CosmicSpheresProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]} // cap pixel ratio for performance
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <CosmicScene count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
}

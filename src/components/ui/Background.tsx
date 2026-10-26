"use client";

import { useState, useEffect } from "react";
import { useAppStore, selectCurrentSection } from "@/lib/store";

const sectionGradients: Record<number, string> = {
  0: "radial-gradient(ellipse at 50% 50%, rgba(76,224,210,0.06) 0%, rgba(5,6,10,0) 70%)",
  1: "radial-gradient(ellipse at 50% 50%, rgba(76,224,210,0.08) 0%, rgba(5,6,10,0) 60%)",
  2: "radial-gradient(ellipse at 30% 40%, rgba(76,224,210,0.07) 0%, rgba(5,6,10,0) 65%)",
  3: "radial-gradient(ellipse at 60% 50%, rgba(91,141,239,0.07) 0%, rgba(5,6,10,0) 65%)",
  4: "radial-gradient(ellipse at 40% 30%, rgba(99,102,241,0.06) 0%, rgba(5,6,10,0) 60%)",
  5: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.08) 0%, rgba(5,6,10,0) 55%)",
  6: "radial-gradient(ellipse at 55% 45%, rgba(255,179,71,0.06) 0%, rgba(5,6,10,0) 65%)",
  7: "radial-gradient(ellipse at 50% 50%, rgba(234,242,255,0.05) 0%, rgba(5,6,10,0) 60%)",
  8: "radial-gradient(ellipse at 50% 50%, rgba(234,242,255,0.06) 0%, rgba(5,6,10,0) 55%)",
};

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function generateStars(): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
    });
  }
  return stars;
}

export default function Background() {
  const currentSection = useAppStore(selectCurrentSection);
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars only on client to avoid hydration mismatch
  useEffect(() => {
    setStars(generateStars());
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Base void gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #05060A 0%, #0C1220 50%, #05060A 100%)",
        }}
      />

      {/* Section-reactive radial glow */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
        style={{
          background:
            sectionGradients[currentSection] || sectionGradients[0],
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse-glow"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "rgba(234,242,255,0.4)",
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle circuit grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(76,224,210,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(76,224,210,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,0.6) 0%, transparent 30%, transparent 70%, rgba(5,6,10,0.6) 100%)",
        }}
      />

      {/* Corner vignettes for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(5,6,10,0.5) 100%)",
        }}
      />
    </div>
  );
}

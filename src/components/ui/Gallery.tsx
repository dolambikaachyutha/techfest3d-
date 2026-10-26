"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

interface GalleryImage {
  id: number;
  title: string;
  year: string;
  category: string;
  color: string;
  icon: string;
  pattern: "circles" | "grid" | "waves" | "diamond" | "radial" | "cross";
}

const galleryImages: GalleryImage[] = [
  { id: 1, title: "Robowars Arena 2024", year: "2024", category: "ROBOTICS", color: "#5B8DEF", icon: "⚔", pattern: "grid" },
  { id: 2, title: "HackFest Winners", year: "2024", category: "HACKATHON", color: "#4CE0D2", icon: "◈", pattern: "circles" },
  { id: 3, title: "AI Summit Keynote", year: "2024", category: "AI", color: "#8B5CF6", icon: "⬡", pattern: "radial" },
  { id: 4, title: "Cosmic Transit Launch", year: "2023", category: "SPACE", color: "#6366F1", icon: "✦", pattern: "waves" },
  { id: 5, title: "Quantum Workshop", year: "2023", category: "QUANTUM", color: "#FF3D8A", icon: "⟐", pattern: "diamond" },
  { id: 6, title: "Techfest Core Ignition", year: "2023", category: "CEREMONY", color: "#FFB347", icon: "◉", pattern: "cross" },
  { id: 7, title: "Living Earth Installation", year: "2022", category: "SUSTAINABILITY", color: "#22C55E", icon: "◎", pattern: "circles" },
  { id: 8, title: "Neural Network Demo", year: "2022", category: "AI", color: "#4CE0D2", icon: "◆", pattern: "radial" },
  { id: 9, title: "Drone Swarm Display", year: "2022", category: "ROBOTICS", color: "#5B8DEF", icon: "▲", pattern: "grid" },
  { id: 10, title: "Exhibition Floor", year: "2021", category: "EXHIBITION", color: "#8B5CF6", icon: "◇", pattern: "waves" },
  { id: 11, title: "Technoholix Stage", year: "2021", category: "CULTURAL", color: "#FF3D8A", icon: "♪", pattern: "cross" },
  { id: 12, title: "Opening Ceremony", year: "2020", category: "CEREMONY", color: "#FFB347", icon: "★", pattern: "diamond" },
];

/** Each card gets a unique geometric art background */
function PatternArt({ color, pattern }: { color: string; pattern: string }) {
  switch (pattern) {
    case "circles":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
          {[40, 65, 90, 115].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="0.5" opacity={0.4 + r * 0.003} />
          ))}
          <circle cx="100" cy="100" r="4" fill={color} opacity="0.6" />
        </svg>
      );
    case "grid":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 200 200">
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i}>
              <line x1={i * 20} y1="0" x2={i * 20} y2="200" stroke={color} strokeWidth="0.3" />
              <line x1="0" y1={i * 20} x2="200" y2={i * 20} stroke={color} strokeWidth="0.3" />
            </g>
          ))}
          <rect x="40" y="40" width="120" height="120" fill="none" stroke={color} strokeWidth="1" opacity="0.5" rx="2" />
          <rect x="60" y="60" width="80" height="80" fill={color} opacity="0.08" rx="1" />
        </svg>
      );
    case "waves":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M 0 ${60 + i * 20} Q 50 ${40 + i * 20} 100 ${60 + i * 20} T 200 ${60 + i * 20}`}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity={0.3 + i * 0.08}
            />
          ))}
        </svg>
      );
    case "diamond":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
          <polygon points="100,20 180,100 100,180 20,100" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
          <polygon points="100,45 155,100 100,155 45,100" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
          <polygon points="100,70 130,100 100,130 70,100" fill={color} opacity="0.08" stroke={color} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="3" fill={color} opacity="0.6" />
        </svg>
      );
    case "radial":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 200 200">
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            // Round: Node and the browser can differ by an ULP on Math.cos/sin,
            // which made the server HTML and client markup disagree (React
            // hydration error). 2 decimals is invisible at this viewBox size.
            const round = (v: number) => Math.round(v * 100) / 100;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={round(100 + Math.cos(angle) * 90)}
                y2={round(100 + Math.sin(angle) * 90)}
                stroke={color}
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}
          <circle cx="100" cy="100" r="30" fill={color} opacity="0.06" />
          <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <circle cx="100" cy="100" r="3" fill={color} opacity="0.8" />
        </svg>
      );
    case "cross":
      return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
          <line x1="100" y1="10" x2="100" y2="190" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <line x1="10" y1="100" x2="190" y2="100" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <line x1="30" y1="30" x2="170" y2="170" stroke={color} strokeWidth="0.4" opacity="0.25" />
          <line x1="170" y1="30" x2="30" y2="170" stroke={color} strokeWidth="0.4" opacity="0.25" />
          <circle cx="100" cy="100" r="20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" />
          <rect x="80" y="80" width="40" height="40" fill={color} opacity="0.06" rx="2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleNext = () => {
    if (!selectedImage) return;
    const idx = galleryImages.findIndex((g) => g.id === selectedImage.id);
    setSelectedImage(galleryImages[(idx + 1) % galleryImages.length]);
  };

  const handlePrev = () => {
    if (!selectedImage) return;
    const idx = galleryImages.findIndex((g) => g.id === selectedImage.id);
    setSelectedImage(galleryImages[(idx - 1 + galleryImages.length) % galleryImages.length]);
  };

  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImage]);

  return (
    <PortfolioSection
      label="GALLERY // MEMORY FIELD"
      heading="FLOATING MEMORIES"
      headingGradient="linear-gradient(135deg, #4CE0D2, #FFB347)"
      description="Each memory floats in 3D space. Scroll to drift between them. Click to enter a memory."
      accent="#4CE0D2"
      index={4}
    >
      {/* Floating memory field */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {galleryImages.map((img, i) => (
            <motion.button
              key={img.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              style={{
                aspectRatio: i % 3 === 0 ? "3/4" : i % 5 === 0 ? "4/3" : "1/1",
              }}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, rotateY: 3, rotateX: -2, z: 20 }}
              onClick={() => setSelectedImage(img)}
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-cursor="VIEW MEMORY"
            >
              {/* Dark card background */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: `linear-gradient(160deg, ${img.color}12 0%, #0C122080 50%, #0A0E1690 100%)`,
                  border: `1px solid ${hoveredId === img.id ? img.color + "40" : img.color + "15"}`,
                }}
              />

              {/* Geometric art pattern */}
              <PatternArt color={img.color} pattern={img.pattern} />

              {/* Icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="text-4xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ color: img.color, filter: `drop-shadow(0 0 12px ${img.color}40)` }}
                >
                  {img.icon}
                </div>
              </div>

              {/* Content at bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: "linear-gradient(transparent 40%, #0A0E16CC 100%)" }}>
                <div className="font-mono text-[8px] mb-1.5" style={{ color: img.color, letterSpacing: "0.15em" }}>
                  {img.year} // {img.category}
                </div>
                <div className="font-display text-sm text-ice font-bold leading-snug">
                  {img.title}
                </div>
              </div>

              {/* Hover scan line */}
              {hoveredId === img.id && (
                <motion.div
                  className="absolute left-0 right-0 h-px"
                  style={{ backgroundColor: img.color, boxShadow: `0 0 8px ${img.color}` }}
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-void/80 backdrop-blur-md" onClick={() => setSelectedImage(null)} />
            <motion.div
              className="relative z-10 w-full max-w-2xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(12, 18, 32, 0.95)",
                  backdropFilter: "blur(24px)",
                  border: `1px solid ${selectedImage.color}30`,
                }}
              >
                {/* Visual area */}
                <div
                  className="w-full aspect-video relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${selectedImage.color}18 0%, #0C1220 50%, #0A0E16 100%)`,
                  }}
                >
                  <PatternArt color={selectedImage.color} pattern={selectedImage.pattern} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-8xl"
                      style={{ color: selectedImage.color, filter: `drop-shadow(0 0 30px ${selectedImage.color}60)`, opacity: 0.5 }}
                    >
                      {selectedImage.icon}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[9px]" style={{ color: selectedImage.color, letterSpacing: "0.15em" }}>
                      MEMORY // {selectedImage.year}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handlePrev} className="font-mono text-[11px] text-ice-dim hover:text-ice transition-colors cursor-pointer px-2">←</button>
                      <button onClick={handleNext} className="font-mono text-[11px] text-ice-dim hover:text-ice transition-colors cursor-pointer px-2">→</button>
                      <button onClick={() => setSelectedImage(null)} className="font-mono text-[11px] text-ice-dim hover:text-ice transition-colors cursor-pointer px-2 ml-1">✕</button>
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-ice font-bold">{selectedImage.title}</h3>
                  <div className="font-mono text-[10px] text-ice-dim mt-2" style={{ letterSpacing: "0.08em" }}>
                    {selectedImage.category}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortfolioSection>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useAppStore,
  selectCurrentSection,
  selectScrollProgress,
} from "@/lib/store";
import { SECTION_LABELS, SECTION_ACCENTS } from "@/lib/constants";

export default function SectionLabel() {
  const currentSection = useAppStore(selectCurrentSection);
  const scrollProgress = useAppStore(selectScrollProgress);

  const label = SECTION_LABELS[currentSection] || "SYS_INIT";
  const accent = (SECTION_ACCENTS as Record<number, string>)[currentSection] || "#4CE0D2";

  // Only show for section 2–7 (the six worlds)
  if (currentSection < 2 || currentSection > 7) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSection}
        className="fixed left-4 md:left-8 bottom-20 md:bottom-24 z-30 pointer-events-none"
        initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Accent line */}
        <div
          className="w-12 h-px mb-3"
          style={{ backgroundColor: accent }}
        />

        {/* Section number */}
        <div
          className="font-mono text-[10px] mb-1"
          style={{ letterSpacing: "0.15em", color: accent }}
        >
          {String(currentSection - 1).padStart(2, "0")}
        </div>

        {/* Section name */}
        <div
          className="font-mono text-xs md:text-sm text-ice"
          style={{ letterSpacing: "0.08em" }}
        >
          {label.replace(/^SEC_\d+ \/\/ /, "")}
        </div>

        {/* Subtle coordinate readout */}
        <div
          className="font-mono text-[9px] text-ice-dim mt-2"
          style={{ letterSpacing: "0.06em" }}
        >
          COORD: {(scrollProgress * 100).toFixed(1)}% // DEPTH:{" "}
          {(currentSection * 12.4).toFixed(0)}AU
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

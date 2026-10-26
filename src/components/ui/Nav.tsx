"use client";

import { motion } from "framer-motion";
import { useAppStore, selectCurrentSection, selectScrollProgress } from "@/lib/store";
import MagneticButton from "./MagneticButton";

const sectionColors: Record<number, string> = {
  0: "#05060A", 1: "#4CE0D2", 2: "#4CE0D2", 3: "#5B8DEF",
  4: "#6366F1", 5: "#8B5CF6", 6: "#FFB347", 7: "#EAF2FF", 8: "#EAF2FF",
};

const SECTION_LABELS: Record<number, string> = {
  0: "SYS_INIT", 1: "HOME",
  2: "SEC_01 // CITY OF MINDS",
  3: "SEC_02 // MECHANICAL KINGDOM",
  4: "SEC_03 // COSMIC EMPIRE",
  5: "SEC_04 // FRACTURED REALITY",
  6: "SEC_05 // LIVING EARTH",
  7: "SEC_06 // HUMAN LEGACY",
  8: "CONVERGENCE",
};

interface NavProps {
  onRegister?: () => void;
  onExplore?: () => void;
}

export default function Nav({ onRegister, onExplore }: NavProps) {
  const currentSection = useAppStore(selectCurrentSection);
  const scrollProgress = useAppStore(selectScrollProgress);

  const accent = sectionColors[currentSection] || "#4CE0D2";
  const progressArc = scrollProgress * 360;

  return (
    <nav className="fixed top-0 left-0 w-full z-40 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Section label */}
        <motion.div
          className="font-mono text-[10px] md:text-xs text-ice-dim pointer-events-auto"
          style={{ letterSpacing: "0.08em" }}
          key={currentSection}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {SECTION_LABELS[currentSection] || "SYS_INIT"}
        </motion.div>

        {/* Center: Techfest 2027 badge */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
          />
          <div
            className="font-mono text-[10px] md:text-xs text-ice-dim"
            style={{ letterSpacing: "0.15em" }}
          >
            TECHFEST 2027
          </div>
        </div>

        {/* Right: nav actions */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <MagneticButton
            onClick={onExplore}
            className="font-mono text-[10px] text-ice-dim hover:text-signal-cyan transition-colors px-3 py-1"
            label="DIMENSIONAL MAP"
          >
            <span style={{ letterSpacing: "0.1em" }}>EXPLORE</span>
          </MagneticButton>

          <MagneticButton
            onClick={onRegister}
            className="font-mono text-[10px] px-4 py-1.5 border rounded-sm transition-all duration-300 hover:bg-signal-cyan/10"
            label="JOIN THE MULTIVERSE"
            style={{ color: accent, borderColor: `${accent}50` }}
          >
            <span style={{ letterSpacing: "0.1em" }}>REGISTER</span>
          </MagneticButton>
        </div>
      </div>

      {/* Right edge: section dots */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
        {[2, 3, 4, 5, 6, 7].map((s) => {
          const isCurrent = currentSection === s;
          const color = sectionColors[s] || "#9AACC4";
          return (
            <button
              key={s}
              className="group relative flex items-center justify-end cursor-pointer"
              aria-label={`Jump to ${SECTION_LABELS[s]}`}
              data-cursor={`ENTER ${SECTION_LABELS[s]?.split("// ")[1] || ""}`}
            >
              {/* Tooltip on hover */}
              <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                <div
                  className="font-mono text-[8px] px-2 py-1 rounded"
                  style={{
                    color,
                    backgroundColor: "rgba(12,18,32,0.9)",
                    border: `1px solid ${color}30`,
                    letterSpacing: "0.08em",
                  }}
                >
                  {SECTION_LABELS[s]?.split("// ")[1]}
                </div>
              </div>
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isCurrent ? color : "rgba(154,172,196,0.25)",
                  boxShadow: isCurrent ? `0 0 10px ${color}80` : "none",
                  transform: isCurrent ? "scale(1.6)" : "scale(1)",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom-left: progress arc */}
      <div className="fixed bottom-4 md:bottom-6 left-4 md:left-6 pointer-events-auto">
        <div className="relative w-11 h-11">
          <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke="rgba(154,172,196,0.1)"
              strokeWidth="1"
            />
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke={accent}
              strokeWidth="1.5"
              strokeDasharray={`${progressArc * 0.314} 113`}
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: accent,
                boxShadow: `0 0 8px ${accent}`,
                opacity: 0.7 + scrollProgress * 0.3,
              }}
            />
          </div>
        </div>
        <div
          className="font-mono text-[8px] text-ice-dim mt-1 text-center"
          style={{ letterSpacing: "0.08em" }}
        >
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>
    </nav>
  );
}

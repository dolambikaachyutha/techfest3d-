"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

const categories = ["ALL", "HARDWARE", "QUANTUM", "NEUROSCIENCE", "SPACE", "AI", "DISPLAY", "SENSING", "CREATIVE AI"];

const booths = [
  { category: "HARDWARE", company: "TECHGIANT", product: "NEURAL PROCESSING UNITS", demo: "LIVE NPU INFERENCE DEMO", accent: "#5B8DEF", icon: "◈" },
  { category: "QUANTUM", company: "QUANTUM LABS", product: "QUANTUM ERROR CORRECTION", demo: "INTERACTIVE QUANTUM CIRCUIT BUILDER", accent: "#8B5CF6", icon: "⟐" },
  { category: "NEUROSCIENCE", company: "NEURAL CORP", product: "BRAIN-COMPUTER INTERFACE", demo: "MIND-CONTROLLED ROBOT ARM", accent: "#FF3D8A", icon: "✦" },
  { category: "SPACE", company: "ORBIT SYSTEMS", product: "CUBESAT PLATFORM", demo: "CUBESAT PROGRAMMING STATION", accent: "#6366F1", icon: "✦" },
  { category: "AI", company: "DATAFLOW", product: "EDGE AI RUNTIME", demo: "REAL-TIME OBJECT DETECTION", accent: "#4CE0D2", icon: "◈" },
  { category: "DISPLAY", company: "VOID TECH", product: "HOLOGRAPHIC DISPLAY", demo: "FLOATING 3D HOLOGRAM VIEWER", accent: "#FF3D8A", icon: "◉" },
  { category: "SENSING", company: "PHOTON", product: "LIDAR MAPPING", demo: "LIVE LIDAR ENVIRONMENT SCAN", accent: "#FFB347", icon: "◎" },
  { category: "CREATIVE AI", company: "SYNTHWAVE AI", product: "GENERATIVE MUSIC", demo: "HUM-TO-MUSIC STATION", accent: "#8B5CF6", icon: "⟐" },
];

export default function ExhibitionCity() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filtered = activeFilter === "ALL" ? booths : booths.filter((b) => b.category === activeFilter);

  return (
    <PortfolioSection
      label="EXHIBITIONS // INNOVATION CITY"
      heading="THE EXHIBITION FLOOR"
      headingGradient="linear-gradient(135deg, #6366F1, #FFB347)"
      description="WALK THROUGH THE FUTURE. EACH BOOTH IS A GATEWAY TO A TECHNOLOGY THAT WILL CHANGE THE WORLD."
      accent="#6366F1"
      index={3}
    >
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            className="font-mono text-[10px] px-4 py-2 rounded-sm transition-all duration-300 cursor-pointer"
            style={{
              color: activeFilter === cat ? "#05060A" : "#9AACC4",
              background: activeFilter === cat ? "#4CE0D2" : "rgba(12,18,32,0.5)",
              border: `1px solid ${activeFilter === cat ? "#4CE0D2" : "rgba(154,172,196,0.1)"}`,
              letterSpacing: "0.1em",
            }}
            onClick={() => setActiveFilter(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-cursor="SELECT"
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Booths grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {filtered.map((booth, i) => (
            <motion.div
              key={booth.company}
              className="group relative overflow-hidden rounded-xl p-5 cursor-pointer"
              style={{
                background: "rgba(12, 18, 32, 0.5)",
                border: `1px solid ${booth.accent}12`,
                backdropFilter: "blur(16px)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{
                y: -4,
                borderColor: `${booth.accent}30`,
                boxShadow: `0 16px 48px ${booth.accent}10`,
              }}
              data-cursor="VIEW"
            >
              <div className="text-xl mb-3" style={{ color: booth.accent }}>{booth.icon}</div>
              <div className="font-mono text-[9px] mb-1" style={{ color: `${booth.accent}70`, letterSpacing: "0.12em" }}>
                {booth.category}
              </div>
              <div className="font-mono text-[9px] text-ice-dim/30 mb-2">{booth.company}</div>
              <h4 className="font-display text-sm font-bold text-ice mb-2">{booth.product}</h4>
              <div className="h-px mb-2" style={{ background: `linear-gradient(90deg, ${booth.accent}20, transparent)` }} />
              <div className="font-mono text-[9px] text-ice-dim/40" style={{ letterSpacing: "0.08em" }}>
                ◈ {booth.demo}
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${booth.accent}08 0%, transparent 60%)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </PortfolioSection>
  );
}

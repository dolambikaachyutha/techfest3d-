"use client";

import { motion } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

const milestones = [
  { year: "2018", title: "GENESIS", desc: "10,000 attendees. First international participation. The spark ignites." },
  { year: "2019", title: "EXPANSION", desc: "25,000 attendees. 200+ events. Asia's largest science festival status confirmed." },
  { year: "2020", title: "DIGITAL SHIFT", desc: "Virtual-first. 50,000 online participants. Proved the future is hybrid." },
  { year: "2021", title: "REBIRTH", desc: "Hybrid format. 35,000 attendees. Innovation doesn't pause." },
  { year: "2022", title: "QUANTUM LEAP", desc: "50,000 attendees. First quantum computing workshop. Robowars go international." },
  { year: "2023", title: "CONVERGENCE", desc: "60,000 attendees. AI Summit debut. Global partnerships. The network grows." },
  { year: "2024", title: "FRONTIER", desc: "75,000 attendees. Space tech lab opens. Sustainability track added. First drone show." },
  { year: "2025", title: "HORIZON", desc: "100,000 attendees. Metaverse integration. Neural interface demo. Records shattered." },
  { year: "2026", title: "ECHO", desc: "120,000 attendees. Quantum internet prototype. Global livestream. The world watches." },
  { year: "2027", title: "THE FUTURE", desc: "Where you are now. The future unfolds." },
];

export default function TimelineTunnel() {
  return (
    <PortfolioSection
      label="TIMELINE TUNNEL // HISTORY IN MOTION"
      heading="A DECADE OF TOMORROW"
      headingGradient="linear-gradient(135deg, #8B5CF6, #4CE0D2)"
      description="Ten years of innovation. From 10,000 attendees to 120,000. The future unfolds."
      accent="#8B5CF6"
      index={7}
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-circuit-line" />

        <div className="space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              className="relative pl-12 md:pl-20 py-6 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              {/* Node dot */}
              <div
                className="absolute left-3 md:left-7 top-8 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                style={{
                  borderColor: m.year === "2027" ? "#FF3D8A" : "#4CE0D2",
                  backgroundColor: m.year === "2027" ? "#FF3D8A" : "transparent",
                  boxShadow: m.year === "2027" ? "0 0 12px #FF3D8A" : "none",
                }}
              />

              {/* Year */}
              <div
                className="font-mono text-xs mb-1"
                style={{
                  letterSpacing: "0.12em",
                  color: m.year === "2027" ? "#FF3D8A" : "#9AACC4",
                }}
              >
                // {m.year}
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-ice mb-1">
                {m.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-ice-dim leading-relaxed max-w-lg">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="text-center mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="font-mono text-[10px] text-ice-dim mb-4" style={{ letterSpacing: "0.15em" }}>
          THE FUTURE IS NOT SOMETHING THAT HAPPENS TO US.
        </div>
        <div className="font-mono text-[10px] text-ice-dim mb-8" style={{ letterSpacing: "0.15em" }}>
          IT IS SOMETHING WE BUILD.
        </div>
        <div className="circuit-line w-24 mx-auto" />
        <div className="font-mono text-[9px] text-ice-dim mt-8" style={{ letterSpacing: "0.08em" }}>
          TECHFEST IIT BOMBAY 2027
        </div>
      </motion.div>
    </PortfolioSection>
  );
}

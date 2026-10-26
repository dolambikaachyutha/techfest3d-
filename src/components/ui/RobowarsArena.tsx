"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import PortfolioSection from "./PortfolioSection";
import MagneticButton from "./MagneticButton";

const robots = [
  { name: "TITAN MK-VII", weight: "30kg", power: 95, wins: 12, accent: "#5B8DEF" },
  { name: "PHANTOM EDGE", weight: "28kg", power: 88, wins: 9, accent: "#8B5CF6" },
  { name: "IRON STORM", weight: "30kg", power: 92, wins: 11, accent: "#FF3D8A" },
  { name: "NEXUS PRIME", weight: "29kg", power: 85, wins: 8, accent: "#4CE0D2" },
  { name: "VORTEX BLADE", weight: "30kg", power: 90, wins: 10, accent: "#6366F1" },
  { name: "CRIMSON FURY", weight: "27kg", power: 82, wins: 7, accent: "#FFB347" },
];

function RobotCard({ robot, index }: { robot: typeof robots[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="ACTIVATE"
    >
      <motion.div
        className="relative overflow-hidden rounded-xl p-5 md:p-6"
        style={{
          background: "rgba(12, 18, 32, 0.5)",
          border: `1px solid ${robot.accent}12`,
          backdropFilter: "blur(16px)",
        }}
        whileHover={{
          y: -3,
          borderColor: `${robot.accent}30`,
          boxShadow: `0 12px 40px ${robot.accent}10`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-display text-sm font-bold text-ice">{robot.name}</h4>
            <span className="font-mono text-[9px] text-ice-dim/40" style={{ letterSpacing: "0.1em" }}>
              {robot.weight} // {robot.wins} WINS
            </span>
          </div>
          <div
            className="font-mono text-lg font-bold"
            style={{ color: robot.accent }}
          >
            {robot.power}
          </div>
        </div>

        {/* Power bar */}
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: `${robot.accent}10` }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: robot.accent }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${robot.power}%` } : undefined}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Glow on bar */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              backgroundColor: robot.accent,
              filter: "blur(4px)",
              opacity: 0.4,
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${robot.power}%` } : undefined}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RobowarsArena() {
  return (
    <PortfolioSection
      label="ARENA // MECHANICAL KINGDOM"
      heading="ROBOWARS"
      headingGradient="linear-gradient(135deg, #5B8DEF, #8B5CF6)"
      description="THE BIGGEST AUTONOMOUS ROBOT COMBAT COMPETITION. 6 TEAMS. 1 ARENA. ₹5,00,000 PRIZE POOL."
      accent="#5B8DEF"
      index={2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10">
        {robots.map((robot, i) => (
          <RobotCard key={robot.name} robot={robot} index={i} />
        ))}
      </div>

      <MagneticButton
        className="font-mono text-sm text-signal-cyan border border-signal-cyan/40 px-8 py-3 rounded-sm hover:bg-signal-cyan/10 transition-all duration-300"
        label="ENTER ARENA"
      >
        <span style={{ letterSpacing: "0.12em" }}>[ ENTER ARENA ]</span>
      </MagneticButton>
    </PortfolioSection>
  );
}

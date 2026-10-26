"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

interface Competition {
  icon: string;
  name: string;
  tagline: string;
  prize: string;
  accent: string;
  bgGradient: string;
}

const competitions: Competition[] = [
  { icon: "◆", name: "AI CHALLENGE", tagline: "Build the smartest agent", prize: "₹2,00,000", accent: "#4CE0D2", bgGradient: "radial-gradient(circle at 50% 50%, rgba(76,224,210,0.1) 0%, transparent 70%)" },
  { icon: "⬡", name: "ROBOWARS", tagline: "30kg combat bots", prize: "₹5,00,000", accent: "#5B8DEF", bgGradient: "radial-gradient(circle at 50% 50%, rgba(91,141,239,0.1) 0%, transparent 70%)" },
  { icon: "⟐", name: "CODE GOLF", tagline: "Fewest bytes wins", prize: "₹50,000", accent: "#8B5CF6", bgGradient: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)" },
  { icon: "◈", name: "DESIGN JAM", tagline: "48h design sprint", prize: "₹1,00,000", accent: "#FF3D8A", bgGradient: "radial-gradient(circle at 50% 50%, rgba(255,61,138,0.1) 0%, transparent 70%)" },
  { icon: "✦", name: "SPACE TECH", tagline: "Build a cubesat", prize: "₹3,00,000", accent: "#6366F1", bgGradient: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)" },
  { icon: "◎", name: "GAMING ARENA", tagline: "Esports tournament", prize: "₹1,50,000", accent: "#FFB347", bgGradient: "radial-gradient(circle at 50% 50%, rgba(255,179,71,0.1) 0%, transparent 70%)" },
];

function PortalCard({ comp, index }: { comp: Competition; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50, rotateY: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: 800 }}
      data-cursor="ENTER"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center"
        style={{
          background: comp.bgGradient,
          border: `1px solid ${comp.accent}15`,
          backdropFilter: "blur(16px)",
          minHeight: 200,
        }}
        whileHover={{
          scale: 1.03,
          borderColor: `${comp.accent}40`,
          rotateY: 3,
          rotateX: -2,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {/* Spinning ring behind icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border"
          style={{ borderColor: `${comp.accent}10` }}
          animate={{
            rotate: 360,
            scale: hovered ? 1.2 : 1,
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border"
          style={{ borderColor: `${comp.accent}08` }}
          animate={{
            rotate: -360,
            scale: hovered ? 1.3 : 1,
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative text-4xl mb-4"
          style={{
            color: comp.accent,
            filter: `drop-shadow(0 0 12px ${comp.accent}40)`,
          }}
          animate={{ scale: hovered ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {comp.icon}
        </motion.div>

        {/* Name */}
        <h3 className="relative font-display text-lg md:text-xl font-bold text-ice mb-2">
          {comp.name}
        </h3>

        {/* Tagline */}
        <p className="relative font-body text-sm text-ice-dim/50 mb-4">{comp.tagline}</p>

        {/* Prize — hidden by default, revealed on hover */}
        <motion.div
          className="relative font-mono text-xs font-bold"
          style={{ color: comp.accent, letterSpacing: "0.1em" }}
          initial={{ opacity: 0, y: 10 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          PRIZE: {comp.prize}
        </motion.div>

        {/* Hover glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${comp.accent}0A 0%, transparent 60%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${comp.accent}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CompetitionsGalaxy() {
  return (
    <PortfolioSection
      label="COMPETITIONS GALAXY // CHOOSE YOUR ARENA"
      heading="ENTER THE PORTALS"
      headingGradient="linear-gradient(135deg, #5B8DEF, #FF3D8A)"
      description="Each competition is a portal to a different dimension of challenge. Step through. Prove yourself."
      accent="#5B8DEF"
      index={1}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {competitions.map((comp, i) => (
          <PortalCard key={comp.name} comp={comp} index={i} />
        ))}
      </div>
    </PortfolioSection>
  );
}

"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAppStore, selectCurrentSection, selectScrollVelocity } from "@/lib/store";

interface FlashCard {
  section: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  stats: { key: string; value: string }[];
  accent: string;
  icon: string;
  enterFrom: "left" | "right" | "top" | "bottom";
}

const flashCards: FlashCard[] = [
  {
    section: 2,
    label: "SEC_01",
    title: "THE NEURAL CITY",
    subtitle: "Artificial Intelligence",
    description:
      "A skyline built from floating neural-network nodes connected by glowing data highways. Hover a node to expand it — data flows accelerate toward your curiosity. The city thinks. The city dreams.",
    stats: [
      { key: "NODES", value: "2.4B" },
      { key: "LATENCY", value: "<2ms" },
      { key: "DOMAIN", value: "OMNI" },
    ],
    accent: "#4CE0D2",
    icon: "◈",
    enterFrom: "left",
  },
  {
    section: 3,
    label: "SEC_02",
    title: "THE ASSEMBLY LINE",
    subtitle: "Robotics World",
    description:
      "Massive robotic arms surround you. Drones fly overhead on noise-based flight paths. Scroll to assemble piece by piece — every scroll distance is a visible outcome. The machine builds itself.",
    stats: [
      { key: "TORQUE", value: "340N·m" },
      { key: "ARMS", value: "×4" },
      { key: "DRONES", value: "12" },
    ],
    accent: "#5B8DEF",
    icon: "⬡",
    enterFrom: "right",
  },
  {
    section: 4,
    label: "SEC_03",
    title: "COSMIC TRANSIT",
    subtitle: "Space Exploration",
    description:
      "Deep cosmic environment. Planets with layered atmosphere shaders orbit in stylized glory. A distant space station watches. Stars twinkle and brighten near your cursor. You are the explorer.",
    stats: [
      { key: "ORBIT", value: "LEO" },
      { key: "STARS", value: "∞" },
      { key: "RANGE", value: "14B LY" },
    ],
    accent: "#6366F1",
    icon: "✦",
    enterFrom: "bottom",
  },
  {
    section: 5,
    label: "SEC_04",
    title: "SUPERPOSITION",
    subtitle: "Quantum Realm",
    description:
      "Reality breaks apart. Particles exist in dual-position states — hover to collapse the wave function into defined geometry. Space bends with gravitational lensing. Nothing behaves normally. Everything evolves.",
    stats: [
      { key: "QUBITS", value: "1024" },
      { key: "COHERENCE", value: "99.7%" },
      { key: "STATE", value: "|ψ⟩" },
    ],
    accent: "#8B5CF6",
    icon: "⟐",
    enterFrom: "top",
  },
  {
    section: 6,
    label: "SEC_05",
    title: "THE LIVING CITY",
    subtitle: "Sustainability Future",
    description:
      "A smart city at golden hour. Vertical forests and solar fields shimmer. Scroll to reroute energy from fossil infrastructure to renewable — the city visibly brightens. Your actions improve the world.",
    stats: [
      { key: "CLEAN", value: "98%" },
      { key: "GRID", value: "100%" },
      { key: "OUTPUT", value: "12GW" },
    ],
    accent: "#FFB347",
    icon: "◎",
    enterFrom: "left",
  },
  {
    section: 7,
    label: "SEC_06",
    title: "CONVERGENCE",
    subtitle: "Human Innovation",
    description:
      "All six worlds merge. The Techfest Core returns, fully evolved — a holographic silhouette of light surrounded by every technology. The future is human. Technology exists because of people.",
    stats: [
      { key: "TEAMS", value: "200+" },
      { key: "NATIONS", value: "42" },
      { key: "IMPACT", value: "∞" },
    ],
    accent: "#EAF2FF",
    icon: "◆",
    enterFrom: "right",
  },
];

/** Entry animations per direction — Gamaliel Das style */
const entryVariants = {
  left: {
    initial: { opacity: 0, x: -120, rotateY: 15, scale: 0.9 },
    animate: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
    exit: { opacity: 0, x: -80, rotateY: -10, scale: 0.92 },
  },
  right: {
    initial: { opacity: 0, x: 120, rotateY: -15, scale: 0.9 },
    animate: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
    exit: { opacity: 0, x: 80, rotateY: 10, scale: 0.92 },
  },
  top: {
    initial: { opacity: 0, y: -100, rotateX: -15, scale: 0.9 },
    animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
    exit: { opacity: 0, y: -60, rotateX: 10, scale: 0.92 },
  },
  bottom: {
    initial: { opacity: 0, y: 100, rotateX: 15, scale: 0.9 },
    animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
    exit: { opacity: 0, y: 60, rotateX: -10, scale: 0.92 },
  },
};

/** Staggered character reveal for titles */
function StaggeredTitle({ text, accent }: { text: string; accent: string }) {
  const chars = text.split("");
  return (
    <h2 className="font-display text-3xl md:text-4xl font-bold mb-1 leading-tight">
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            background: `linear-gradient(135deg, ${accent}, #EAF2FF)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 20, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15 + i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
}

/** Stats that count up */
function AnimatedStat({ stat, accent, delay }: { stat: { key: string; value: string }; accent: string; delay: number }) {
  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="font-mono text-[9px] text-ice-dim mb-1.5" style={{ letterSpacing: "0.12em" }}>
        {stat.key}
      </div>
      <div className="font-mono text-lg font-bold" style={{ color: accent, letterSpacing: "0.05em" }}>
        {stat.value}
      </div>
      {/* Progress bar */}
      <motion.div
        className="h-px mt-2 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

function FlashCard3D({ card, isActive }: { card: FlashCard; isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollVelocity = useAppStore(selectScrollVelocity);

  // Spring-physics tilt toward cursor
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  // Scroll velocity reactive — card shifts slightly with scroll speed
  const scrollShift = useMemo(() => Math.min(Math.abs(scrollVelocity) * 200, 15), [scrollVelocity]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const variant = entryVariants[card.enterFrom];

  return (
    <motion.div
      ref={cardRef}
      className="w-full max-w-2xl mx-auto"
      style={{ perspective: 1200 }}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          y: scrollShift,
          transformStyle: "preserve-3d",
          background: "rgba(12, 18, 32, 0.65)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: `1px solid ${card.accent}20`,
          boxShadow: `0 0 60px ${card.accent}08, 0 20px 60px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Top accent line — animated */}
        <motion.div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="p-8 md:p-10">
          {/* Section label + icon row */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className="font-mono text-[10px]"
              style={{ letterSpacing: "0.15em", color: card.accent }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {card.label}
            </motion.div>
            <motion.div
              className="text-2xl"
              style={{ color: card.accent, filter: `drop-shadow(0 0 8px ${card.accent}40)` }}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            >
              {card.icon}
            </motion.div>
          </div>

          {/* Title — staggered character reveal */}
          <StaggeredTitle text={card.title} accent={card.accent} />

          {/* Subtitle — slides in from left */}
          <motion.div
            className="font-mono text-xs mb-6"
            style={{ letterSpacing: "0.1em", color: card.accent, opacity: 0.7 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {card.subtitle}
          </motion.div>

          {/* Circuit divider — draws in */}
          <motion.div
            className="h-px mb-6"
            style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Description — fades up */}
          <motion.p
            className="font-body text-sm md:text-base text-ice-dim leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {card.description}
          </motion.p>

          {/* Stats row — staggered in from bottom */}
          <div className="flex gap-6">
            {card.stats.map((stat, i) => (
              <AnimatedStat key={stat.key} stat={stat} accent={card.accent} delay={0.8 + i * 0.1} />
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${card.accent}50, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Corner glow — reactive to cursor */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${card.accent}12 0%, transparent 70%)`,
            opacity: useTransform(mouseX, [-0.5, 0.5], [0.3, 1]),
          }}
        />

        {/* Reflection shimmer — sweeps across */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${card.accent}06 45%, ${card.accent}0A 50%, ${card.accent}06 55%, transparent 60%)`,
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
        />

        {/* Floating particles inside card */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              backgroundColor: card.accent,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function SectionFlashCards() {
  const currentSection = useAppStore(selectCurrentSection);
  const activeCard = flashCards.find((c) => c.section === currentSection);
  const activeIndex = flashCards.findIndex((c) => c.section === currentSection);

  return (
    <div className="fixed inset-0 z-15 pointer-events-none flex items-center justify-center">
      {/* Background glow — changes color per section */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            key={activeCard.section}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${activeCard.accent}06 0%, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Flash cards */}
      <AnimatePresence mode="wait">
        {activeCard && (
          <FlashCard3D
            key={activeCard.section}
            card={activeCard}
            isActive={true}
          />
        )}
      </AnimatePresence>

      {/* Progress indicators — animated */}
      {activeIndex >= 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto z-20">
          {flashCards.map((c, i) => (
            <motion.div
              key={c.section}
              className="relative h-1 rounded-full overflow-hidden"
              style={{
                width: i === activeIndex ? 40 : 16,
                backgroundColor: "rgba(154,172,196,0.15)",
              }}
              animate={{
                width: i === activeIndex ? 40 : 16,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {i === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: c.accent, boxShadow: `0 0 8px ${c.accent}` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

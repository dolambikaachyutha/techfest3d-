"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface PortfolioSectionProps {
  children: ReactNode;
  label: string;
  heading: string;
  headingGradient?: string;
  description?: string;
  accent?: string;
  index?: number;
  className?: string;
  fullScreen?: boolean;
}

/* ============================================================
   Full-screen portfolio section wrapper
   Each section gets:
   - Unique radial gradient background
   - Staggered entrance animation (label → heading → content)
   - Ambient floating particles
   - Smooth parallax on scroll
   ============================================================ */
export default function PortfolioSection({
  children,
  label,
  heading,
  headingGradient,
  description,
  accent = "#4CE0D2",
  index = 0,
  className = "",
  fullScreen = true,
}: PortfolioSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Alternate background gradients per section
  const bgGradients = [
    `radial-gradient(ellipse at 30% 20%, ${accent}06 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${accent}04 0%, transparent 40%)`,
    `radial-gradient(ellipse at 60% 30%, ${accent}05 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(139,92,246,0.03) 0%, transparent 45%)`,
    `radial-gradient(ellipse at 40% 60%, ${accent}06 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,61,138,0.03) 0%, transparent 40%)`,
    `radial-gradient(ellipse at 50% 40%, ${accent}05 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(99,102,241,0.03) 0%, transparent 45%)`,
    `radial-gradient(ellipse at 70% 50%, ${accent}04 0%, transparent 50%), radial-gradient(ellipse at 30% 20%, rgba(255,179,71,0.03) 0%, transparent 40%)`,
    `radial-gradient(ellipse at 20% 40%, ${accent}06 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(76,224,210,0.03) 0%, transparent 45%)`,
    `radial-gradient(ellipse at 50% 30%, ${accent}05 0%, transparent 55%), radial-gradient(ellipse at 40% 80%, rgba(139,92,246,0.03) 0%, transparent 40%)`,
    `radial-gradient(ellipse at 30% 70%, ${accent}04 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(255,61,138,0.03) 0%, transparent 45%)`,
  ];

  // Split heading into words for staggered reveal
  const words = heading.split(" ");

  return (
    <section
      ref={ref}
      className={`relative ${fullScreen ? "min-h-screen" : ""} flex flex-col justify-center overflow-hidden ${className}`}
      style={{ background: bgGradients[index % bgGradients.length] }}
    >
      {/* Ambient floating particles — unique per section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + i * 0.5,
              height: 2 + i * 0.5,
              backgroundColor: accent,
              opacity: 0.08 + i * 0.02,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15 - i * 3, 0],
              x: [0, (i % 2 === 0 ? 8 : -8), 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-10 py-24 md:py-32 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        {/* Section label — slides in from left */}
        <motion.div
          className="font-mono text-[10px] md:text-xs mb-6"
          style={{ letterSpacing: "0.25em", color: `${accent}90` }}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {label}
        </motion.div>

        {/* Heading — character-by-character reveal */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-6">
          {words.map((word, wi) => (
            <span key={wi} className="inline-block mr-3 md:mr-4">
              {word.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  className="inline-block"
                  style={
                    headingGradient && wi === words.length - 1
                      ? {
                          background: headingGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : { color: "#EAF2FF" }
                  }
                  initial={{ opacity: 0, y: 35, rotateX: -50 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + (wi * 5 + ci) * 0.025,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>

        {/* Accent line — draws in */}
        <motion.div
          className="h-px mb-8"
          style={{
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            maxWidth: 160,
          }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={isInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Description — fades up */}
        {description && (
          <motion.p
            className="font-body text-base md:text-lg text-ice-dim/60 max-w-2xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {description}
          </motion.p>
        )}

        {/* Children — the actual section content */}
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>

      {/* Bottom divider — glowing line */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}15, transparent)`,
          }}
        />
      </div>
    </section>
  );
}

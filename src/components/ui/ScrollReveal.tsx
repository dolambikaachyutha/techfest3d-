"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  parallax?: boolean;
  parallaxOffset?: number;
  once?: boolean;
  className?: string;
  scale?: boolean;
  blur?: boolean;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 60,
  parallax = false,
  parallaxOffset = -40,
  once = true,
  className = "",
  scale = false,
  blur = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: "-80px 0px -80px 0px",
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: element shifts slightly as it scrolls through viewport
  const parallaxY = useTransform(scrollYProgress, [0, 1], [parallaxOffset, -parallaxOffset]);

  const dirMap: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = dirMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: scale ? 0.92 : 1,
        filter: blur ? "blur(8px)" : "blur(0px)",
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }
          : undefined
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={parallax ? { y: parallaxY } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   STAGGER CONTAINER — children animate in sequence
   ============================================================ */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  direction?: Direction;
  distance?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
  direction = "up",
  distance = 40,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-60px 0px -60px 0px",
  });

  const dirMap: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = dirMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: {
                  opacity: 0,
                  x: offset.x,
                  y: offset.y,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/* ============================================================
   SECTION HEADER — animated reveal for section labels
   ============================================================ */
export function SectionReveal({
  label,
  heading,
  description,
  accent = "#4CE0D2",
}: {
  label: string;
  heading: string;
  description?: string;
  accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const words = heading.split(" ");

  return (
    <div ref={ref} className="mb-12 md:mb-16">
      <motion.div
        className="font-mono text-xs mb-4"
        style={{ letterSpacing: "0.2em", color: accent, opacity: 0.6 }}
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 0.6, x: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {label}
      </motion.div>

      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block mr-3">
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                style={
                  word === words[words.length - 1]
                    ? {
                        background: `linear-gradient(135deg, ${accent}, #EAF2FF)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : undefined
                }
                initial={{ opacity: 0, y: 30, rotateX: -60 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : undefined
                }
                transition={{
                  duration: 0.5,
                  delay: 0.1 + (wi * 4 + ci) * 0.025,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        ))}
      </h2>

      {description && (
        <motion.p
          className="font-body text-base md:text-lg text-ice-dim max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.7, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {description}
        </motion.p>
      )}

      <motion.div
        className="h-px mt-6"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          maxWidth: 120,
        }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={isInView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

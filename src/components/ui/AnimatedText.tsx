"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  glow?: boolean;
  gradient?: boolean;
  gradientColors?: string;
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
  as: Tag = "h2",
  glow = false,
  gradient = false,
  gradientColors = "from-signal-cyan to-quantum-violet",
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={`${className} inline-flex flex-wrap`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex mr-[0.3em]">
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className={`inline-block ${gradient ? `bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent` : ""} ${glow ? "drop-shadow-[0_0_8px_rgba(76,224,210,0.5)]" : ""}`}
              initial={{ opacity: 0, y: 20, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + (wi * words[0].length + ci) * staggerDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ perspective: 400 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

// Depth-staggered paragraph lines
export function StaggeredLines({
  lines,
  className = "",
  lineDelay = 0,
}: {
  lines: string[];
  className?: string;
  lineDelay?: number;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30, z: -50 * (i + 1) }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{
            duration: 0.8,
            delay: lineDelay + i * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ perspective: 600 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

// Reveal-on-scroll text with underline energy line
export function RevealText({
  text,
  className = "",
  accent = "#4CE0D2",
}: {
  text: string;
  className?: string;
  accent?: string;
}) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span>{text}</span>
      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ backgroundColor: accent }}
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

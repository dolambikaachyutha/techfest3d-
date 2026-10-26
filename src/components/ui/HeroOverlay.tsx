"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectIsBooted, selectCurrentSection } from "@/lib/store";
import AnimatedText from "./AnimatedText";
import MagneticButton from "./MagneticButton";

export default function HeroOverlay() {
  const isBooted = useAppStore(selectIsBooted);
  const currentSection = useAppStore(selectCurrentSection);
  const [launching, setLaunching] = useState(false);

  const handleEnter = useCallback(() => {
    setLaunching(true);
    // After the energy wave animation, scroll into the multiverse
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight * 0.08, behavior: "smooth" });
    }, 1200);
    // Reset after transition
    setTimeout(() => setLaunching(false), 2500);
  }, []);

  if (!isBooted || currentSection > 1) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
      {/* Energy wave — triggered on ENTER click */}
      <AnimatePresence>
        {launching && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Expanding ring from center */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  border: `2px solid rgba(76, 224, 210, ${0.5 - i * 0.15})`,
                  boxShadow: `0 0 ${40 + i * 20}px rgba(76, 224, 210, ${0.3 - i * 0.1})`,
                }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{
                  width: [0, 2000],
                  height: [0, 2000],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
            {/* Central flash */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(76,224,210,0.8) 0%, transparent 70%)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 50, 0] }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Horizontal scan line */}
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{
                top: "50%",
                background: "linear-gradient(90deg, transparent, rgba(76,224,210,0.6), transparent)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, opacity: [1, 0] }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eyebrow */}
      <motion.div
        className="font-mono text-[10px] md:text-xs text-signal-cyan mb-6"
        style={{ letterSpacing: "0.2em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        TECHFEST 2027 // IIT BOMBAY
      </motion.div>

      {/* Main headline — character-by-character animated */}
      <AnimatedText
        text="THE FUTURE"
        as="h1"
        className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-ice text-center leading-none"
        delay={0.5}
        staggerDelay={0.04}
      />

      <AnimatedText
        text="UNFOLDS"
        as="h1"
        className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center leading-none"
        delay={0.9}
        staggerDelay={0.05}
        gradient
        gradientColors="from-signal-cyan to-quantum-violet"
        glow
      />

      {/* Subtitle */}
      <motion.div
        className="font-mono text-[10px] md:text-xs text-ice-dim mt-4"
        style={{ letterSpacing: "0.15em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        WHERE THE FUTURE BECOMES REAL
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="flex gap-4 mt-10 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <MagneticButton
          className="font-mono text-xs text-signal-cyan border border-signal-cyan/50 px-8 py-3 hover:bg-signal-cyan/10 transition-all duration-300 rounded-sm"
          label="BEGIN JOURNEY"
          onClick={handleEnter}
        >
          <span style={{ letterSpacing: "0.12em" }}>{launching ? "ENTERING..." : "BEGIN JOURNEY ↓"}</span>
        </MagneticButton>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-16 font-mono text-[10px] md:text-xs text-ice-dim"
        style={{ letterSpacing: "0.1em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 2, delay: 2.5, repeat: Infinity }}
      >
        SCROLL TO BEGIN JOURNEY ↓
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

export default function ReducedMotionToggle() {
  const { reducedMotion, setReducedMotion } = useAppStore();
  const [showPrompt, setShowPrompt] = useState(false);

  // Check system preference on mount
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
    }
    // Show prompt after 5s for manual toggle
    const t = setTimeout(() => setShowPrompt(true), 5000);
    return () => clearTimeout(t);
  }, [setReducedMotion]);

  // Apply to document
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  return (
    <>
      {/* Persistent toggle — top right area */}
      <motion.button
        className="fixed top-4 right-4 z-[105] font-mono text-[9px] px-3 py-1.5 rounded cursor-pointer"
        style={{
          letterSpacing: "0.1em",
          background: "rgba(12,18,32,0.7)",
          border: `1px solid ${reducedMotion ? "rgba(76,224,210,0.3)" : "rgba(154,172,196,0.15)"}`,
          color: reducedMotion ? "#4CE0D2" : "#6B7C94",
          backdropFilter: "blur(8px)",
        }}
        onClick={() => setReducedMotion(!reducedMotion)}
        whileHover={{ scale: 1.05 }}
        data-cursor="TOGGLE MOTION"
      >
        {reducedMotion ? "◉ MOTION: OFF" : "○ MOTION: ON"}
      </motion.button>

      {/* Auto-prompt on first visit */}
      <AnimatePresence>
        {showPrompt && !reducedMotion && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[130]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "rgba(12,18,32,0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(154,172,196,0.15)",
              }}
            >
              <span className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.08em" }}>
                Experience feels heavy?
              </span>
              <button
                onClick={() => {
                  setReducedMotion(true);
                  setShowPrompt(false);
                }}
                className="font-mono text-[9px] text-signal-cyan hover:text-ice transition-colors cursor-pointer"
                style={{ letterSpacing: "0.08em" }}
              >
                REDUCE MOTION
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="font-mono text-[9px] text-ice-dim hover:text-ice transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

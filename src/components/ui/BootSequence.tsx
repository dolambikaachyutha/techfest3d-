"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectLoadingProgress, selectIsBooted } from "@/lib/store";

const bootLines = [
  "INITIALIZING TECHFEST FUTURE SYSTEMS...",
  "LOADING NEURAL INTERFACE PROTOCOLS...",
  "CONNECTING INNOVATION NETWORK...",
  "SYNCHRONIZING QUANTUM PROCESSORS...",
  "WELCOME TO TOMORROW.",
];

export default function BootSequence() {
  const loadingProgress = useAppStore(selectLoadingProgress);
  const isBooted = useAppStore(selectIsBooted);
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress);
  const setIsBooted = useAppStore((s) => s.setIsBooted);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showEnter, setShowEnter] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setLoadingProgress(Math.min(progress, 1));
      if (progress >= 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [setLoadingProgress]);

  useEffect(() => {
    // Type out boot lines sequentially
    const lineTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= bootLines.length) {
          clearInterval(lineTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // Show skip after 2s
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => { clearInterval(lineTimer); clearTimeout(skipTimer); };
  }, []);

  useEffect(() => {
    if (loadingProgress >= 1 && visibleLines >= bootLines.length) {
      setTimeout(() => setShowEnter(true), 500);
    }
  }, [loadingProgress, visibleLines]);

  if (isBooted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Terminal text area */}
      <div className="max-w-xl w-full px-8">
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs md:text-sm text-signal-cyan mb-2"
            style={{ letterSpacing: "0.08em" }}
          >
            <span className="text-ice-dim">&gt; </span>{line}
          </motion.div>
        ))}

        {/* Loading bar */}
        <div className="mt-8 h-px bg-deep-slate w-full relative overflow-hidden">
          <motion.div
            className="h-full bg-signal-cyan"
            style={{ width: `${loadingProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="font-mono text-[10px] text-ice-dim mt-2" style={{ letterSpacing: "0.08em" }}>
          LOADING: {Math.round(loadingProgress * 100)}%
        </div>

        {/* Enter button */}
        {showEnter && (
          <motion.button
            onClick={() => setIsBooted(true)}
            className="mt-8 font-mono text-sm text-signal-cyan border border-signal-cyan px-8 py-3 hover:bg-signal-cyan/10 transition-colors cursor-pointer"
            style={{ letterSpacing: "0.15em" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            [ ENTER ]
          </motion.button>
        )}
      </div>

      {/* Skip button */}
      {showSkip && (
        <motion.button
          onClick={() => setIsBooted(true)}
          className="absolute bottom-8 right-8 font-mono text-xs text-ice-dim hover:text-ice transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ letterSpacing: "0.08em" }}
        >
          SKIP INTRO
        </motion.button>
      )}
    </motion.div>
  );
}

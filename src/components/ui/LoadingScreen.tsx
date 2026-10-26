"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectLoadingProgress, selectIsBooted } from "@/lib/store";

const loadingPhases = [
  "INITIALIZING SENTIENT CORE",
  "CALIBRATING REALITY",
  "SYNCING WORLDS",
  "MULTIVERSE ONLINE",
];

export default function LoadingScreen() {
  const loadingProgress = useAppStore(selectLoadingProgress);
  const isBooted = useAppStore(selectIsBooted);
  const setLoadingProgress = useAppStore((s) => s.setLoadingProgress);
  const setIsBooted = useAppStore((s) => s.setIsBooted);
  const [phase, setPhase] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(true);

  const bootLines = [
    "INITIALIZING SENTIENT CORE...",
    "LOADING GLOBAL INNOVATION NETWORK...",
    "CALIBRATING QUANTUM PROCESSORS...",
    "SYNCING WORLDS...",
    "MULTIVERSE ONLINE.",
  ];

  // Loading progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.012;
      setLoadingProgress(Math.min(progress, 1));
      if (progress >= 1) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [setLoadingProgress]);

  // Phase text
  useEffect(() => {
    const p = Math.floor(loadingProgress * loadingPhases.length);
    setPhase(Math.min(p, loadingPhases.length - 1));
  }, [loadingProgress]);

  // Terminal typing
  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < bootLines.length) {
        setTerminalLines((prev) => [...prev, bootLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Show skip after 2s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Show enter when loaded
  useEffect(() => {
    if (loadingProgress >= 1) {
      setTimeout(() => {
        setShowTerminal(false);
        setShowEnter(true);
      }, 800);
    }
  }, [loadingProgress]);

  if (isBooted) return null;

  const coreScale = 0.3 + loadingProgress * 0.7;
  const coreOpacity = 0.3 + loadingProgress * 0.7;
  const ringRotation = loadingProgress * 720;
  const glowIntensity = 20 + loadingProgress * 60;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void">
      {/* Terminal text area — appears first */}
      {showTerminal && (
        <div className="absolute inset-0 flex flex-col justify-center px-8 max-w-2xl mx-auto w-full">
          {terminalLines.map((line, i) => (
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
          <div className="mt-6 h-px bg-deep-slate w-full relative overflow-hidden">
            <motion.div
              className="h-full bg-signal-cyan"
              style={{ width: `${loadingProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div
            className="font-mono text-[10px] text-ice-dim mt-2"
            style={{ letterSpacing: "0.08em" }}
          >
            {loadingPhases[phase]}
          </div>
        </div>
      )}

      {/* Energy core visualization — centered */}
      <div className="relative w-40 h-40">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border border-signal-cyan/15"
          style={{ transform: `rotate(${ringRotation}deg)` }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full border border-signal-cyan/25"
          style={{ transform: `rotate(${-ringRotation * 0.7}deg)` }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-4 rounded-full border border-signal-cyan/10"
          style={{ transform: `rotate(${ringRotation * 1.3}deg)` }}
        />
        {/* Core glow */}
        <div className="absolute inset-8 flex items-center justify-center">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(76,224,210,${coreOpacity}) 0%, rgba(76,224,210,0) 70%)`,
              transform: `scale(${coreScale})`,
              boxShadow: `0 0 ${glowIntensity}px rgba(76,224,210,${0.2 + loadingProgress * 0.5}), 0 0 ${glowIntensity * 2}px rgba(76,224,210,${loadingProgress * 0.15})`,
            }}
          />
        </div>
        {/* Center point */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: "#4CE0D2",
              boxShadow: `0 0 ${10 + loadingProgress * 20}px rgba(76,224,210,0.8)`,
              transform: `scale(${0.5 + loadingProgress * 0.5})`,
            }}
          />
        </div>
        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center mt-16">
          <span
            className="font-mono text-xs text-signal-cyan"
            style={{ letterSpacing: "0.1em" }}
          >
            {Math.round(loadingProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Enter button */}
      {showEnter && (
        <motion.button
          onClick={() => setIsBooted(true)}
          className="mt-12 font-mono text-sm text-signal-cyan border border-signal-cyan/60 px-10 py-3 hover:bg-signal-cyan/10 transition-all duration-300 cursor-pointer"
          style={{ letterSpacing: "0.15em" }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(76,224,210,0.3)" }}
          whileTap={{ scale: 0.95 }}
          data-cursor="ENTER THE MULTIVERSE"
        >
          [ ENTER ]
        </motion.button>
      )}

      {/* Skip button */}
      {showSkip && (
        <motion.button
          onClick={() => setIsBooted(true)}
          className="absolute bottom-8 right-8 font-mono text-xs text-ice-dim hover:text-ice transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ letterSpacing: "0.08em" }}
          data-cursor="SKIP"
        >
          SKIP INTRO
        </motion.button>
      )}
    </div>
  );
}

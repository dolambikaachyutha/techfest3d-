"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const idleMessages = [
  { text: "EXPLORATION DETECTED", accent: "#4CE0D2" },
  { text: "THE MULTIVERSE IS AWARE OF YOU", accent: "#8B5CF6" },
  { text: "SYSTEM CURIOUSITY LEVEL: HIGH", accent: "#5B8DEF" },
  { text: "YOU ARE BEING OBSERVED", accent: "#FF3D8A" },
  { text: "NAVIGATING DATA STREAMS...", accent: "#4CE0D2" },
  { text: "NEURAL PATHWAYS ACTIVATING", accent: "#6366F1" },
  { text: "THE UNIVERSE REMEMBERS YOU", accent: "#FFB347" },
  { text: "SENDER BROADCAST: ALL NODES", accent: "#4CE0D2" },
  { text: "QUANTUM STATE: OBSERVED", accent: "#8B5CF6" },
  { text: "ENERGY SIGNATURE DETECTED", accent: "#FFB347" },
];

export default function SentientIdle() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [position, setPosition] = useState<"tl" | "tr" | "bl" | "br" | "center">("bl");
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (visible) setVisible(false);
    };

    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });

    // Check idle every second
    timerRef.current = setInterval(() => {
      const idleTime = (Date.now() - lastActivityRef.current) / 1000;
      if (idleTime > 8 && !visible) {
        // Show message
        setCurrent(Math.floor(Math.random() * idleMessages.length));
        const positions: Array<"tl" | "tr" | "bl" | "br" | "center"> = ["tl", "tr", "bl", "br"];
        setPosition(positions[Math.floor(Math.random() * positions.length)]);
        setVisible(true);

        // Auto-hide after 4 seconds
        setTimeout(() => setVisible(false), 4000);
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  const msg = idleMessages[current];

  const posClasses = {
    tl: "top-24 left-8 md:left-16",
    tr: "top-24 right-8 md:right-16",
    bl: "bottom-32 left-8 md:left-16",
    br: "bottom-32 right-8 md:right-16",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={current}
          className={`fixed z-30 pointer-events-none ${posClasses[position]}`}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            {/* Pulsing dot */}
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: msg.accent }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <div
                className="font-mono text-[10px] md:text-xs"
                style={{
                  color: msg.accent,
                  letterSpacing: "0.2em",
                  textShadow: `0 0 20px ${msg.accent}40`,
                }}
              >
                {msg.text}
              </div>
              <div
                className="font-mono text-[8px] mt-1"
                style={{ color: "rgba(154,172,196,0.3)", letterSpacing: "0.15em" }}
              >
                SENTIENT MULTIVERSE // IDLE RESPONSE
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

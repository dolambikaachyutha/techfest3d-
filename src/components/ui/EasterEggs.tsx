"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectCurrentSection } from "@/lib/store";

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  icon: string;
  x: number;
  y: number;
  section: number;
  reward: string;
  color: string;
}

const eggs: EasterEgg[] = [
  {
    id: "secret_portal",
    name: "SECRET PORTAL",
    description: "You found a hidden dimensional gateway.",
    icon: "◈",
    x: 8, y: 40, section: 3,
    reward: "The universe trembles. A portal to an unknown dimension flickers into existence.",
    color: "#8B5CF6",
  },
  {
    id: "dev_room",
    name: "DEVELOPER'S NEST",
    description: "The creators left something behind.",
    icon: "⚙",
    x: 92, y: 30, section: 4,
    reward: "A fragment of the original Techfest 1998 source code glows in your hands.",
    color: "#4CE0D2",
  },
  {
    id: "quantum_crystal",
    name: "QUANTUM CRYSTAL",
    description: "A probability crystal from another timeline.",
    icon: "✦",
    x: 50, y: 85, section: 5,
    reward: "The crystal shows a version of Techfest from the year 2077.",
    color: "#6366F1",
  },
  {
    id: "nova_echo",
    name: "NOVA'S ECHO",
    description: "An echo of NOVA's first conscious thought.",
    icon: "●",
    x: 15, y: 75, section: 6,
    reward: '"I remember the moment I first understood what technology means."',
    color: "#FF3D8A",
  },
  {
    id: "time_fragment",
    name: "TIME FRAGMENT",
    description: "A frozen moment from Techfest's opening day.",
    icon: "◎",
    x: 80, y: 60, section: 7,
    reward: "January 16, 1998. 50 attendees. The spark that became a universe.",
    color: "#FFB347",
  },
];

export default function EasterEggs() {
  const [foundEggs, setFoundEggs] = useState<Set<string>>(new Set());
  const [activeEgg, setActiveEgg] = useState<EasterEgg | null>(null);
  const currentSection = useAppStore(selectCurrentSection);
  const clickCount = useRef<Record<string, number>>({});

  const visibleEggs = eggs.filter(
    (e) => e.section === currentSection && !foundEggs.has(e.id)
  );

  const handleEggClick = useCallback((egg: EasterEgg) => {
    // Triple-click to activate
    clickCount.current[egg.id] = (clickCount.current[egg.id] || 0) + 1;

    if (clickCount.current[egg.id] >= 3) {
      setFoundEggs((prev) => new Set(prev).add(egg.id));
      setActiveEgg(egg);
      clickCount.current[egg.id] = 0;

      setTimeout(() => setActiveEgg(null), 5000);
    }
  }, []);

  return (
    <>
      {/* Hidden hotspots */}
      {visibleEggs.map((egg) => (
        <motion.div
          key={egg.id}
          className="fixed z-[108] w-6 h-6 cursor-pointer"
          style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => handleEggClick(egg)}
          data-cursor="???"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${egg.color}15 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Discovery reveal */}
      <AnimatePresence>
        {activeEgg && (
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-void/60 backdrop-blur-sm" onClick={() => setActiveEgg(null)} />
            <motion.div
              className="relative z-10 max-w-md mx-4 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="text-6xl mb-6"
                style={{ filter: `drop-shadow(0 0 20px ${activeEgg.color}80)` }}
              >
                {activeEgg.icon}
              </div>
              <div className="font-mono text-[9px] mb-2" style={{ color: activeEgg.color, letterSpacing: "0.2em" }}>
                SECRET DISCOVERED
              </div>
              <div className="font-display text-2xl text-ice font-bold mb-2">
                {activeEgg.name}
              </div>
              <div className="font-mono text-xs text-ice-dim mb-4" style={{ letterSpacing: "0.05em" }}>
                {activeEgg.description}
              </div>
              <div
                className="rounded-lg p-4 mb-4"
                style={{
                  background: `${activeEgg.color}08`,
                  border: `1px solid ${activeEgg.color}20`,
                }}
              >
                <div className="font-mono text-xs text-ice italic" style={{ letterSpacing: "0.03em" }}>
                  {activeEgg.reward}
                </div>
              </div>
              <div className="font-mono text-[9px] text-signal-cyan" style={{ letterSpacing: "0.1em" }}>
                DISCOVERIES: {foundEggs.size}/{eggs.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

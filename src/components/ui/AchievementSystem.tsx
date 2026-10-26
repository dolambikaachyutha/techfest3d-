"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectCurrentSection } from "@/lib/store";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
}

interface Discovery {
  id: string;
  name: string;
  description: string;
  xp: number;
  x: number; // percentage position on screen
  y: number;
  section: number;
}

const defaultAchievements: Achievement[] = [
  { id: "first_contact", name: "FIRST CONTACT", description: "Enter the Sentient Multiverse", icon: "◈", xp: 100, unlocked: false },
  { id: "neural_explorer", name: "NEURAL EXPLORER", description: "Discover 3 AI nodes in City of Minds", icon: "⬡", xp: 200, unlocked: false },
  { id: "machine_architect", name: "MACHINE ARCHITECT", description: "Activate all assembly stations", icon: "⚙", xp: 250, unlocked: false },
  { id: "cosmic_traveler", name: "COSMIC TRAVELER", description: "Visit all planets in Cosmic Empire", icon: "✦", xp: 300, unlocked: false },
  { id: "reality_breaker", name: "REALITY BREAKER", description: "Collapse a quantum superposition", icon: "⟐", xp: 200, unlocked: false },
  { id: "earth_guardian", name: "EARTH GUARDIAN", description: "Restore balance to Living Earth", icon: "◎", xp: 250, unlocked: false },
  { id: "multiverse_master", name: "MULTIVERSE MASTER", description: "Discover all hidden secrets", icon: "◆", xp: 1000, unlocked: false },
  { id: "nova_friend", name: "NOVA'S FRIEND", description: "Have 10 conversations with NOVA", icon: "●", xp: 150, unlocked: false },
  { id: "speed_runner", name: "SPEED RUNNER", description: "Complete the journey in under 60 seconds", icon: "⚡", xp: 500, unlocked: false },
  { id: "deep_diver", name: "DEEP DIVER", description: "Spend 10 minutes exploring", icon: "◉", xp: 300, unlocked: false },
];

const hiddenDiscoveries: Discovery[] = [
  { id: "portal_alpha", name: "PORTAL ALPHA", description: "A hidden dimensional gateway", xp: 250, x: 12, y: 35, section: 3 },
  { id: "ancient_code", name: "ANCIENT CODE", description: "First Techfest source code fragment", xp: 150, x: 85, y: 45, section: 2 },
  { id: "quantum_orb", name: "QUANTUM ORB", description: "A probability crystal from another timeline", xp: 200, x: 45, y: 70, section: 5 },
  { id: "star_map", name: "STAR MAP", description: "Coordinates to Techfest's 50th anniversary", xp: 300, x: 70, y: 25, section: 4 },
  { id: "nova_memory", name: "NOVA'S MEMORY", description: "A fragment of NOVA's consciousness", xp: 175, x: 25, y: 80, section: 6 },
  { id: "time_crystal", name: "TIME CRYSTAL", description: "Frozen moment from Techfest 1998", xp: 200, x: 55, y: 15, section: 7 },
];

// Persistent state via sessionStorage (with fallback)
function getSavedAchievements(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("tf_achievements") || "{}");
  } catch { return {}; }
}

function saveAchievements(achs: Record<string, boolean>) {
  try { sessionStorage.setItem("tf_achievements", JSON.stringify(achs)); } catch {}
}

function getSavedDiscoveries(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem("tf_discoveries") || "[]");
  } catch { return []; }
}

function saveDiscoveries(ids: string[]) {
  try { sessionStorage.setItem("tf_discoveries", JSON.stringify(ids)); } catch {}
}

// Achievement toast
function AchievementToast({ achievement, onDone }: { achievement: Achievement; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed top-20 left-1/2 z-[160] pointer-events-none"
      initial={{ opacity: 0, y: -30, x: "-50%", scale: 0.8 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-lg"
        style={{
          background: "rgba(12,18,32,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(76,224,210,0.3)",
          boxShadow: "0 0 40px rgba(76,224,210,0.2)",
        }}
      >
        <div className="text-2xl" style={{ filter: "drop-shadow(0 0 8px rgba(76,224,210,0.6))" }}>
          {achievement.icon}
        </div>
        <div>
          <div className="font-mono text-[8px] text-signal-cyan" style={{ letterSpacing: "0.2em" }}>
            ACHIEVEMENT UNLOCKED
          </div>
          <div className="font-mono text-xs text-ice mt-0.5" style={{ letterSpacing: "0.1em" }}>
            {achievement.name}
          </div>
          <div className="font-mono text-[9px] text-ice-dim mt-0.5" style={{ letterSpacing: "0.08em" }}>
            {achievement.description}
          </div>
        </div>
        <div className="font-mono text-sm text-signal-cyan font-bold ml-4">
          +{achievement.xp}
        </div>
      </div>
    </motion.div>
  );
}

// Hidden discovery orb in 3D space
function DiscoveryOrb({ discovery, onCollect }: { discovery: Discovery; onCollect: (id: string) => void }) {
  const [collected, setCollected] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (collected) return null;

  return (
    <motion.button
      className="fixed z-[110] pointer-events-auto cursor-pointer"
      style={{ left: `${discovery.x}%`, top: `${discovery.y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [0.8, 1.1, 0.8],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setCollected(true);
        onCollect(discovery.id);
      }}
      data-cursor="DISCOVER"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
        style={{
          background: "radial-gradient(circle, rgba(76,224,210,0.4) 0%, transparent 70%)",
          boxShadow: hovered
            ? "0 0 30px rgba(76,224,210,0.6)"
            : "0 0 15px rgba(76,224,210,0.3)",
        }}
      >
        ✦
      </div>
      {hovered && (
        <motion.div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-mono text-[8px] text-signal-cyan bg-void/90 px-2 py-1 rounded border border-signal-cyan/20" style={{ letterSpacing: "0.1em" }}>
            {discovery.name}
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = getSavedAchievements();
    return defaultAchievements.map((a) => ({ ...a, unlocked: saved[a.id] || false }));
  });
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const collectedDiscoveries = useRef(new Set(getSavedDiscoveries()));
  const currentSection = useAppStore(selectCurrentSection);

  // Count discoveries per section
  const sectionDiscoveries = useRef<Record<number, number>>({});

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id && !a.unlocked) {
          setToastQueue((q) => [...q, a]);
          setTotalXP((xp) => xp + a.xp);
          return { ...a, unlocked: true };
        }
        return a;
      });
      const saved: Record<string, boolean> = {};
      updated.forEach((a) => { if (a.unlocked) saved[a.id] = true; });
      saveAchievements(saved);
      return updated;
    });
  }, []);

  const collectDiscovery = useCallback((id: string) => {
    if (collectedDiscoveries.current.has(id)) return;
    collectedDiscoveries.current.add(id);
    saveDiscoveries([...collectedDiscoveries.current]);

    const disc = hiddenDiscoveries.find((d) => d.id === id);
    if (disc) {
      setTotalXP((xp) => xp + disc.xp);
      // Create a pseudo-achievement toast
      const pseudo: Achievement = {
        id: `disc_${id}`,
        name: disc.name,
        description: disc.description,
        icon: "✧",
        xp: disc.xp,
        unlocked: true,
      };
      setToastQueue((q) => [...q, pseudo]);
    }

    // Check if all discoveries found
    if (collectedDiscoveries.current.size >= hiddenDiscoveries.length) {
      unlockAchievement("multiverse_master");
    }
  }, [unlockAchievement]);

  // Auto-unlock first contact on mount
  useEffect(() => {
    unlockAchievement("first_contact");
  }, [unlockAchievement]);

  // Process toast queue
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      setCurrentToast(toastQueue[0]);
      setToastQueue((q) => q.slice(1));
    }
  }, [toastQueue, currentToast]);

  // Show discoveries for current section
  const visibleDiscoveries = hiddenDiscoveries.filter(
    (d) => d.section === currentSection && !collectedDiscoveries.current.has(d.id)
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {currentToast && (
          <AchievementToast
            achievement={currentToast}
            onDone={() => setCurrentToast(null)}
          />
        )}
      </AnimatePresence>

      {/* XP display */}
      <motion.button
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[105] pointer-events-auto cursor-pointer"
        onClick={() => setShowPanel(!showPanel)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        data-cursor="VIEW ACHIEVEMENTS"
      >
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: "rgba(12,18,32,0.7)",
            border: "1px solid rgba(76,224,210,0.15)",
          }}
        >
          <span className="text-signal-cyan text-xs">◆</span>
          <span className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
            {totalXP} XP
          </span>
          <span className="font-mono text-[8px] text-ice-dim" style={{ letterSpacing: "0.08em" }}>
            {unlockedCount}/{achievements.length}
          </span>
        </div>
      </motion.button>

      {/* Hidden discovery orbs */}
      {visibleDiscoveries.map((d) => (
        <DiscoveryOrb key={d.id} discovery={d} onCollect={collectDiscovery} />
      ))}

      {/* Achievements panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="fixed inset-0 z-[155] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" onClick={() => setShowPanel(false)} />
            <motion.div
              className="relative z-10 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto rounded-xl p-6"
              style={{
                background: "rgba(12,18,32,0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(76,224,210,0.15)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-mono text-[9px] text-signal-cyan" style={{ letterSpacing: "0.2em" }}>
                    MULTIVERSE EXPLORER
                  </div>
                  <div className="font-display text-xl text-ice mt-1">ACHIEVEMENTS</div>
                </div>
                <button onClick={() => setShowPanel(false)} className="font-mono text-[10px] text-ice-dim hover:text-ice cursor-pointer">
                  [CLOSE]
                </button>
              </div>

              <div className="font-mono text-[10px] text-ice-dim mb-4" style={{ letterSpacing: "0.1em" }}>
                TOTAL XP: <span className="text-signal-cyan">{totalXP}</span> · DISCOVERIES:{" "}
                <span className="text-signal-cyan">{collectedDiscoveries.current.size}/{hiddenDiscoveries.length}</span>
              </div>

              <div className="space-y-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{
                      background: a.unlocked ? "rgba(76,224,210,0.05)" : "transparent",
                      border: `1px solid ${a.unlocked ? "rgba(76,224,210,0.15)" : "rgba(154,172,196,0.08)"}`,
                      opacity: a.unlocked ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="text-lg"
                      style={{
                        filter: a.unlocked ? "drop-shadow(0 0 6px rgba(76,224,210,0.4))" : "grayscale(1)",
                      }}
                    >
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] text-ice" style={{ letterSpacing: "0.1em" }}>
                        {a.name}
                      </div>
                      <div className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.05em" }}>
                        {a.description}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-signal-cyan">+{a.xp}</div>
                    {a.unlocked && (
                      <div className="font-mono text-[8px] text-signal-cyan">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorldSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const worlds = [
  { id: 1, name: "CITY OF MINDS", subtitle: "AI CIVILIZATION", accent: "#4CE0D2", icon: "◈" },
  { id: 2, name: "MECHANICAL KINGDOM", subtitle: "ROBOTICS", accent: "#5B8DEF", icon: "⬡" },
  { id: 3, name: "COSMIC EMPIRE", subtitle: "SPACE", accent: "#6366F1", icon: "✦" },
  { id: 4, name: "FRACTURED REALITY", subtitle: "QUANTUM", accent: "#8B5CF6", icon: "⟐" },
  { id: 5, name: "LIVING EARTH", subtitle: "SUSTAINABILITY", accent: "#FFB347", icon: "◎" },
  { id: 6, name: "HUMAN LEGACY", subtitle: "CONVERGENCE", accent: "#EAF2FF", icon: "◆" },
];

export default function WorldSelector({ isOpen, onClose }: WorldSelectorProps) {
  const [hoveredWorld, setHoveredWorld] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-void/70 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="relative z-10 w-[400px] h-[400px]">
            {/* Center core */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(76,224,210,0.2) 0%, transparent 70%)",
                border: "1px solid rgba(76,224,210,0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(76,224,210,0.2)",
                  "0 0 40px rgba(76,224,210,0.4)",
                  "0 0 20px rgba(76,224,210,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xl text-signal-cyan">◆</span>
            </motion.div>

            {/* Orbiting worlds */}
            {worlds.map((world, i) => {
              const angle = (i / worlds.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 150;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isHovered = hoveredWorld === world.id;

              return (
                <motion.button
                  key={world.id}
                  className="absolute left-1/2 top-1/2 cursor-pointer group"
                  style={{ x: x - 24, y: y - 24 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredWorld(world.id)}
                  onMouseLeave={() => setHoveredWorld(null)}
                  data-cursor={`ENTER ${world.subtitle}`}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      border: `1px solid ${isHovered ? world.accent : "rgba(154,172,196,0.2)"}`,
                      backgroundColor: isHovered ? `${world.accent}15` : "rgba(12,18,32,0.8)",
                      boxShadow: isHovered ? `0 0 20px ${world.accent}40` : "none",
                    }}
                    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                  >
                    <span style={{ color: world.accent, fontSize: "16px" }}>
                      {world.icon}
                    </span>
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center mt-2"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        <div className="font-mono text-[9px]" style={{ color: world.accent, letterSpacing: "0.1em" }}>
                          0{world.id}
                        </div>
                        <div className="font-mono text-[10px] text-ice" style={{ letterSpacing: "0.08em" }}>
                          {world.name}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

            {/* Orbit ring */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="rgba(76,224,210,0.08)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 font-mono text-[10px] text-ice-dim hover:text-ice transition-colors cursor-pointer z-20"
            style={{ letterSpacing: "0.1em" }}
          >
            [CLOSE]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectActivePanel } from "@/lib/store";

interface PanelData {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

const panels: Record<string, PanelData> = {
  "generative-systems": {
    title: "Generative Systems",
    description: "Neural architectures that create: from procedural art and music to protein folding and drug discovery. These systems dream new possibilities from learned patterns.",
    stats: [{ label: "PARAMS", value: "1.7T" }, { label: "LATENCY", value: "<50ms" }, { label: "DOMAIN", value: "MULTI-MODAL" }],
  },
  "autonomous-agents": {
    title: "Autonomous Agents",
    description: "Self-directed AI systems that plan, reason, and execute complex multi-step tasks in dynamic environments. Agents that learn to navigate the real world.",
    stats: [{ label: "SUCCESS", value: "94.2%" }, { label: "STEPS", value: "50+" }, { label: "ENV", value: "OPEN-WORLD" }],
  },
  "neural-interfaces": {
    title: "Neural Interfaces",
    description: "Brain-computer interfaces decoding motor intent, restoring speech, and enabling direct neural communication. The boundary between mind and machine dissolves.",
    stats: [{ label: "CHANNELS", value: "1024" }, { label: "BANDWIDTH", value: "200bps" }, { label: "LATENCY", value: "<10ms" }],
  },
  "foundation-models": {
    title: "Foundation Models",
    description: "Massive pre-trained models serving as the substrate for countless applications. Transfer learning at scale: one model, infinite specializations.",
    stats: [{ label: "TOKENS", value: "15T" }, { label: "LAYERS", value: "128" }, { label: "ACCURACY", value: "97.1%" }],
  },
  "ai-safety": {
    title: "AI Safety & Alignment",
    description: "Ensuring advanced AI systems remain beneficial, interpretable, and aligned with human values. From constitutional AI to mechanistic interpretability.",
    stats: [{ label: "RESEARCH", value: "ACTIVE" }, { label: "TEAMS", value: "200+" }, { label: "PRIORITY", value: "CRITICAL" }],
  },
};

export default function HologramInfoPanel() {
  const activePanel = useAppStore(selectActivePanel);
  const setActivePanel = useAppStore((s) => s.setActivePanel);
  const data = activePanel ? panels[activePanel] : null;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-72 md:w-80 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-panel p-5">
            <button
              onClick={() => setActivePanel(null)}
              className="absolute top-3 right-3 text-ice-dim hover:text-ice transition-colors text-xs cursor-pointer"
            >
              [X]
            </button>
            <h3 className="font-display text-lg text-ice font-semibold mb-2">{data.title}</h3>
            <div className="circuit-line w-full mb-3" />
            <p className="font-body text-sm text-ice-dim leading-relaxed mb-4">{data.description}</p>
            <div className="flex gap-4">
              {data.stats.map((stat) => (
                <div key={stat.label} className="flex-1">
                  <div className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.08em" }}>{stat.label}</div>
                  <div className="font-mono text-sm text-signal-cyan" style={{ letterSpacing: "0.05em" }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

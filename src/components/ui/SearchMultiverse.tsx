"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  type: "event" | "competition" | "workshop" | "exhibition" | "sponsor" | "venue";
  category: string;
  description: string;
  date?: string;
  color: string;
}

const searchIndex: SearchResult[] = [
  { id: "r1", name: "ROBOWARS", type: "competition", category: "ROBOTICS", description: "Autonomous bot combat arena. ₹5L prize pool.", date: "JAN 17", color: "#FF3D8A" },
  { id: "r2", name: "HACKFEST 36H", type: "competition", category: "HACKATHON", description: "36-hour code marathon. Teams of 4. ₹3L prizes.", date: "JAN 16-17", color: "#5B8DEF" },
  { id: "r3", name: "AI CHALLENGE", type: "competition", category: "AI", description: "Machine learning model competition.", date: "JAN 16", color: "#4CE0D2" },
  { id: "r4", name: "TECHNOHOLIX", type: "event", category: "CULTURAL", description: "Flagship cultural night with celebrity performances.", date: "JAN 16-17", color: "#FF3D8A" },
  { id: "r5", name: "AI SUMMIT", type: "event", category: "AI", description: "Keynotes from global AI leaders.", date: "JAN 17", color: "#4CE0D2" },
  { id: "r6", name: "QUANTUM WORKSHOP", type: "workshop", category: "QUANTUM", description: "Hands-on quantum computing with IBM Qiskit.", date: "JAN 17", color: "#6366F1" },
  { id: "r7", name: "SPACE TECH WORKSHOP", type: "workshop", category: "SPACE", description: "CubeSat design and orbital mechanics.", date: "JAN 16", color: "#8B5CF6" },
  { id: "r8", name: "SUSTAINABILITY EXPO", type: "exhibition", category: "SUSTAINABILITY", description: "Green tech innovations showcase.", date: "JAN 17-18", color: "#22C55E" },
  { id: "r9", name: "INNOVATION HUB", type: "exhibition", category: "STARTUP", description: "Startup showcase and investor meet.", date: "JAN 17", color: "#FFB347" },
  { id: "r10", name: "QUANTUM LEAP", type: "competition", category: "QUANTUM", description: "Quantum algorithm design challenge.", date: "JAN 18", color: "#6366F1" },
  { id: "r11", name: "GUEST LECTURE: FUTURE OF AI", type: "event", category: "AI", description: "Visionary talk on AGI and beyond.", date: "JAN 18", color: "#4CE0D2" },
  { id: "r12", name: "NEURAL NETWORK WORKSHOP", type: "workshop", category: "AI", description: "Build and train deep learning models.", date: "JAN 16", color: "#4CE0D2" },
  { id: "r13", name: "DRONE RACING", type: "competition", category: "ROBOTICS", description: "FPV drone racing through obstacle courses.", date: "JAN 17", color: "#FF3D8A" },
  { id: "r14", name: "MAIN AUDITORIUM", type: "venue", category: "VENUE", description: "Primary venue for keynotes and ceremonies.", color: "#9AACC4" },
  { id: "r15", name: "HACK ZONE", type: "venue", category: "VENUE", description: "Dedicated hackathon space with 24/7 power.", color: "#9AACC4" },
  { id: "r16", name: "TECHGIANT", type: "sponsor", category: "PLATINUM SPONSOR", description: "Global technology partner.", color: "#FFB347" },
  { id: "r17", name: "QUANTUM LABS", type: "sponsor", category: "PLATINUM SPONSOR", description: "Quantum computing research partner.", color: "#6366F1" },
];

const typeIcons: Record<string, string> = {
  event: "◈", competition: "⚔", workshop: "⚙", exhibition: "◉", sponsor: "★", venue: "⊙",
};

export default function SearchMultiverse() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = searchIndex.filter((item) => {
    const matchesQuery = !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    const matchesType = !selectedType || item.type === selectedType;
    return matchesQuery && matchesType;
  });

  const types = ["event", "competition", "workshop", "exhibition", "sponsor", "venue"];

  return (
    <>
      {/* Trigger button — in Nav or standalone */}
      <motion.button
        className="fixed bottom-6 left-6 z-[120] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(12,18,32,0.9) 70%)",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: isOpen
            ? "0 0 30px rgba(139,92,246,0.4)"
            : "0 0 15px rgba(139,92,246,0.2)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        data-cursor="SEARCH THE MULTIVERSE"
      >
        <span className="text-quantum-violet text-sm">⌘</span>
      </motion.button>

      {/* Search overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[155] flex items-start justify-center pt-[15vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            {/* Search panel */}
            <motion.div
              className="relative z-10 w-full max-w-xl mx-4 rounded-xl overflow-hidden"
              style={{
                background: "rgba(12, 18, 32, 0.95)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-circuit-line">
                <span className="text-quantum-violet text-sm">⌘</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the multiverse..."
                  className="flex-1 bg-transparent font-mono text-sm text-ice placeholder:text-ice-dim/40 focus:outline-none"
                  style={{ letterSpacing: "0.05em" }}
                />
                <button onClick={() => setIsOpen(false)} className="font-mono text-[10px] text-ice-dim hover:text-ice cursor-pointer">
                  ESC
                </button>
              </div>

              {/* Type filters */}
              <div className="flex gap-2 px-5 py-3 border-b border-circuit-line overflow-x-auto">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`font-mono text-[9px] px-3 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer ${
                    !selectedType ? "border-quantum-violet/50 text-quantum-violet bg-quantum-violet/10" : "border-circuit-line text-ice-dim hover:text-ice"
                  }`}
                  style={{ letterSpacing: "0.08em" }}
                >
                  ALL
                </button>
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? null : t)}
                    className={`font-mono text-[9px] px-3 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer uppercase ${
                      selectedType === t ? "border-quantum-violet/50 text-quantum-violet bg-quantum-violet/10" : "border-circuit-line text-ice-dim hover:text-ice"
                    }`}
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {typeIcons[t]} {t}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {filtered.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <div className="font-mono text-xs text-ice-dim" style={{ letterSpacing: "0.1em" }}>
                      NO ENTITIES FOUND IN THIS SECTOR
                    </div>
                  </div>
                )}
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-3 border-b border-circuit-line/50 cursor-pointer group"
                    style={{ borderLeft: `2px solid transparent` }}
                    whileHover={{
                      backgroundColor: `${item.color}08`,
                      borderLeftColor: item.color,
                    }}
                    onClick={() => setIsOpen(false)}
                    data-cursor="EXPLORE"
                  >
                    <div className="text-lg" style={{ color: item.color }}>
                      {typeIcons[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[9px] mb-0.5" style={{ color: item.color, letterSpacing: "0.1em" }}>
                        {item.category}
                      </div>
                      <div className="font-display text-sm text-ice font-bold truncate">
                        {item.name}
                      </div>
                      <div className="font-mono text-[9px] text-ice-dim truncate" style={{ letterSpacing: "0.03em" }}>
                        {item.description}
                      </div>
                    </div>
                    {item.date && (
                      <div className="font-mono text-[9px] text-ice-dim flex-shrink-0" style={{ letterSpacing: "0.08em" }}>
                        {item.date}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-circuit-line">
                <div className="font-mono text-[8px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
                  {filtered.length} ENTITIES FOUND · ⌘K TO TOGGLE · ESC TO CLOSE
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

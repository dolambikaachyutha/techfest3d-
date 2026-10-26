"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    id: "identity",
    label: "IDENTITY",
    subtitle: "Who are you, explorer?",
  },
  {
    id: "path",
    label: "CHOOSE YOUR PATH",
    subtitle: "Select your worlds",
  },
  {
    id: "confirm",
    label: "CONFIRM",
    subtitle: "Verify your journey",
  },
  {
    id: "complete",
    label: "ENTER THE MULTIVERSE",
    subtitle: "Your journey begins",
  },
];

const eventOptions = [
  { id: "ai", name: "AI CHALLENGE", accent: "#4CE0D2" },
  { id: "robo", name: "ROBOWARS", accent: "#5B8DEF" },
  { id: "hack", name: "HACKFEST 36H", accent: "#FF3D8A" },
  { id: "space", name: "SPACE TECH", accent: "#6366F1" },
  { id: "design", name: "DESIGN JAM", accent: "#FFB347" },
  { id: "quantum", name: "QUANTUM LAB", accent: "#8B5CF6" },
];

export default function RegistrationFlow({ isOpen, onClose }: RegistrationFlowProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleEvent = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-lg mx-4"
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 800 }}
          >
            <div
              className="rounded-xl p-8"
              style={{
                background: "rgba(12, 18, 32, 0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(76, 224, 210, 0.15)",
              }}
            >
              {/* Progress dots */}
              <div className="flex gap-2 mb-8">
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex-1 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor:
                        i <= step
                          ? "#4CE0D2"
                          : "rgba(154,172,196,0.2)",
                      boxShadow:
                        i === step ? "0 0 8px #4CE0D2" : "none",
                    }}
                  />
                ))}
              </div>

              {/* Step label */}
              <div
                className="font-mono text-[10px] text-signal-cyan mb-2"
                style={{ letterSpacing: "0.15em" }}
              >
                STEP {String(step + 1).padStart(2, "0")} // {steps[step].label}
              </div>
              <div className="font-body text-sm text-ice-dim mb-6">
                {steps[step].subtitle}
              </div>

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="FULL NAME"
                      className="w-full bg-deep-slate/50 border border-circuit-line rounded px-4 py-3 font-mono text-xs text-ice placeholder:text-ice-dim/40 focus:outline-none focus:border-signal-cyan/50"
                      style={{ letterSpacing: "0.08em" }}
                    />
                    <input
                      type="email"
                      placeholder="EMAIL"
                      className="w-full bg-deep-slate/50 border border-circuit-line rounded px-4 py-3 font-mono text-xs text-ice placeholder:text-ice-dim/40 focus:outline-none focus:border-signal-cyan/50"
                      style={{ letterSpacing: "0.08em" }}
                    />
                    <input
                      type="tel"
                      placeholder="PHONE"
                      className="w-full bg-deep-slate/50 border border-circuit-line rounded px-4 py-3 font-mono text-xs text-ice placeholder:text-ice-dim/40 focus:outline-none focus:border-signal-cyan/50"
                      style={{ letterSpacing: "0.08em" }}
                    />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="path"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {eventOptions.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => toggleEvent(ev.id)}
                        className="p-3 rounded border text-left cursor-pointer transition-all duration-300"
                        style={{
                          borderColor: selected.includes(ev.id)
                            ? ev.accent
                            : "rgba(154,172,196,0.15)",
                          backgroundColor: selected.includes(ev.id)
                            ? `${ev.accent}10`
                            : "transparent",
                        }}
                      >
                        <div
                          className="font-mono text-[9px] mb-1"
                          style={{
                            letterSpacing: "0.1em",
                            color: selected.includes(ev.id) ? ev.accent : "#9AACC4",
                          }}
                        >
                          {selected.includes(ev.id) ? "◆" : "◇"} {ev.name}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="font-mono text-[10px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
                      SELECTED WORLDS: {selected.length}
                    </div>
                    {selected.map((id) => {
                      const ev = eventOptions.find((e) => e.id === id);
                      return ev ? (
                        <div
                          key={id}
                          className="flex items-center gap-3 p-2 rounded"
                          style={{ borderLeft: `2px solid ${ev.accent}` }}
                        >
                          <span className="font-mono text-xs text-ice" style={{ letterSpacing: "0.08em" }}>
                            {ev.name}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-full border border-signal-cyan/40 flex items-center justify-center"
                      animate={{ boxShadow: ["0 0 20px #4CE0D240", "0 0 40px #4CE0D260", "0 0 20px #4CE0D240"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-2xl">◆</span>
                    </motion.div>
                    <div className="font-display text-xl text-ice mb-2">
                      YOUR JOURNEY HAS BEGUN.
                    </div>
                    <div className="font-mono text-[10px] text-signal-cyan" style={{ letterSpacing: "0.15em" }}>
                      WELCOME TO THE MULTIVERSE
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex justify-between items-center mt-8">
                {step > 0 && step < 3 && (
                  <MagneticButton
                    onClick={() => setStep(step - 1)}
                    className="font-mono text-[10px] text-ice-dim hover:text-ice transition-colors px-4 py-2"
                    label="BACK"
                  >
                    <span style={{ letterSpacing: "0.1em" }}>← BACK</span>
                  </MagneticButton>
                )}
                <div className="flex-1" />
                {step < 3 ? (
                  <MagneticButton
                    onClick={nextStep}
                    className="font-mono text-[10px] text-signal-cyan border border-signal-cyan/40 px-6 py-2 hover:bg-signal-cyan/10 transition-colors rounded"
                    label={step === 2 ? "REGISTER" : "NEXT"}
                  >
                    <span style={{ letterSpacing: "0.12em" }}>
                      {step === 2 ? "REGISTER →" : "NEXT →"}
                    </span>
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    onClick={onClose}
                    className="font-mono text-[10px] text-signal-cyan border border-signal-cyan/40 px-6 py-2 hover:bg-signal-cyan/10 transition-colors rounded"
                    label="ENTER"
                  >
                    <span style={{ letterSpacing: "0.12em" }}>ENTER THE MULTIVERSE</span>
                  </MagneticButton>
                )}
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 font-mono text-[10px] text-ice-dim hover:text-ice transition-colors cursor-pointer"
              >
                [X]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

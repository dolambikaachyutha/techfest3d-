"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectCurrentSection, selectAudioEnabled } from "@/lib/store";

const worldSounds: Record<number, { name: string; frequency: number; type: OscillatorType }> = {
  0: { name: "DEEP PULSE", frequency: 55, type: "sine" },
  1: { name: "DEEP PULSE", frequency: 55, type: "sine" },
  2: { name: "DIGITAL AMBIENCE", frequency: 220, type: "square" },
  3: { name: "INDUSTRIAL DRONE", frequency: 110, type: "sawtooth" },
  4: { name: "COSMIC HUM", frequency: 80, type: "sine" },
  5: { name: "QUANTUM GLITCH", frequency: 330, type: "sawtooth" },
  6: { name: "NATURAL AMBIENCE", frequency: 165, type: "sine" },
  7: { name: "EMOTIONAL SCORE", frequency: 196, type: "sine" },
};

export default function AudioSystem() {
  const audioEnabled = useAppStore(selectAudioEnabled);
  const toggleAudio = useAppStore((s) => s.toggleAudio);
  const currentSection = useAppStore(selectCurrentSection);
  const [volume, setVolume] = useState(0.15);
  const [showVolume, setShowVolume] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const currentSectionRef = useRef(0);

  const startAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const sound = worldSounds[currentSection] || worldSounds[0];
      osc.type = sound.type;
      osc.frequency.value = sound.frequency;
      osc.connect(gain);
      osc.start();

      audioCtxRef.current = ctx;
      gainRef.current = gain;
      oscRef.current = osc;
      currentSectionRef.current = currentSection;
    } catch (e) {
      console.warn("Audio not available:", e);
    }
  }, [volume, currentSection]);

  const stopAudio = useCallback(() => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    gainRef.current = null;
  }, []);

  const handleToggle = () => {
    if (audioEnabled) {
      stopAudio();
    } else {
      startAudio();
    }
    toggleAudio();
  };

  // Update oscillator when section changes
  if (audioEnabled && audioCtxRef.current && currentSection !== currentSectionRef.current) {
    currentSectionRef.current = currentSection;
    const sound = worldSounds[currentSection] || worldSounds[0];
    if (oscRef.current) {
      try {
        oscRef.current.frequency.linearRampToValueAtTime(
          sound.frequency,
          audioCtxRef.current.currentTime + 0.5
        );
      } catch {}
    }
  }

  // Update volume
  if (gainRef.current) {
    gainRef.current.gain.value = volume;
  }

  return (
    <>
      {/* Audio toggle button */}
      <motion.button
        className="fixed top-4 right-20 z-[105] font-mono text-[9px] px-3 py-1.5 rounded cursor-pointer"
        style={{
          letterSpacing: "0.1em",
          background: "rgba(12,18,32,0.7)",
          border: `1px solid ${audioEnabled ? "rgba(76,224,210,0.3)" : "rgba(154,172,196,0.15)"}`,
          color: audioEnabled ? "#4CE0D2" : "#6B7C94",
          backdropFilter: "blur(8px)",
        }}
        onClick={handleToggle}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        whileHover={{ scale: 1.05 }}
        data-cursor={audioEnabled ? "SOUND OFF" : "SOUND ON"}
      >
        {audioEnabled ? "◉ AUDIO" : "○ AUDIO"}
      </motion.button>

      {/* Volume slider */}
      <AnimatePresence>
        {showVolume && audioEnabled && (
          <motion.div
            className="fixed top-10 right-20 z-[106]"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded"
              style={{
                background: "rgba(12,18,32,0.9)",
                border: "1px solid rgba(76,224,210,0.15)",
              }}
            >
              <span className="font-mono text-[8px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
                VOL
              </span>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 appearance-none rounded cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4CE0D2 ${volume * 200}%, #1A2438 ${volume * 200}%)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current world sound indicator */}
      <AnimatePresence>
        {audioEnabled && (
          <motion.div
            className="fixed bottom-6 left-20 z-[105] flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-signal-cyan rounded-full"
                  animate={{
                    height: [4, 12, 6, 10, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="font-mono text-[8px] text-signal-cyan" style={{ letterSpacing: "0.1em" }}>
              {worldSounds[currentSection]?.name || "AMBIENCE"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

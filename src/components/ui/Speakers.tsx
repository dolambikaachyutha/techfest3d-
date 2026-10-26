"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import PortfolioSection from "./PortfolioSection";


interface Speaker {
  id: number;
  name: string;
  title: string;
  topic: string;
  day: string;
  time: string;
  venue: string;
  tier: "keynote" | "featured" | "speaker";
  accent: string;
  silhouette: string; // SVG path data for abstract silhouette
}

const speakers: Speaker[] = [
  {
    id: 1,
    name: "DR. ANANYA REddy",
    title: "Chief AI Scientist, DeepMind",
    topic: "The Next Frontier of Artificial General Intelligence",
    day: "DAY 1",
    time: "10:00 — 11:30",
    venue: "GRAND AMPHITHEATRE",
    tier: "keynote",
    accent: "#4CE0D2",
    silhouette: "M50 15 C55 10 65 12 68 20 C70 28 65 35 60 38 L62 50 C65 55 60 60 55 58 L55 70 C55 75 45 75 45 70 L45 58 C40 60 35 55 38 50 L40 38 C35 35 30 28 32 20 C35 12 45 10 50 15Z",
  },
  {
    id: 2,
    name: "PROF. KENJI TANAKA",
    title: "Quantum Computing Lead, IBM Research",
    topic: "Quantum Advantage: From Theory to Reality",
    day: "DAY 1",
    time: "14:00 — 15:30",
    venue: "QUANTUM WING",
    tier: "keynote",
    accent: "#8B5CF6",
    silhouette: "M50 12 C58 8 68 14 70 22 C72 30 66 38 58 40 L60 52 C63 58 58 64 52 62 L52 72 C52 76 48 76 48 72 L48 62 C42 64 37 58 40 52 L42 40 C34 38 28 30 30 22 C32 14 42 8 50 12Z",
  },
  {
    id: 3,
    name: "SARAH CHEN",
    title: "CTO, SpaceX Starlink Division",
    topic: "Building the Infrastructure of Tomorrow",
    day: "DAY 2",
    time: "10:00 — 11:30",
    venue: "SPACE LAB",
    tier: "keynote",
    accent: "#6366F1",
    silhouette: "M50 14 C56 10 66 12 68 20 C70 28 64 36 58 38 L56 50 C60 56 56 62 50 60 L50 72 C50 76 50 76 50 72 L50 60 C44 62 40 56 44 50 L42 38 C36 36 30 28 32 20 C34 12 44 10 50 14Z",
  },
  {
    id: 4,
    name: "DR. MARIA OKONKWO",
    title: "Director of Robotics, Boston Dynamics",
    topic: "Autonomous Systems and Human-Robot Collaboration",
    day: "DAY 2",
    time: "14:00 — 15:30",
    venue: "MAIN ARENA",
    tier: "featured",
    accent: "#5B8DEF",
    silhouette: "M50 13 C57 9 67 13 69 21 C71 29 65 37 59 39 L57 51 C61 57 57 63 51 61 L51 73 C51 77 49 77 49 73 L49 61 C43 63 39 57 43 51 L41 39 C35 37 29 29 31 21 C33 13 43 9 50 13Z",
  },
  {
    id: 5,
    name: "PROF. AMIR PATEL",
    title: "Neural Interface Lab, MIT",
    topic: "Brain-Computer Interfaces: The Next Leap",
    day: "DAY 3",
    time: "10:00 — 11:30",
    venue: "NEURAL OBSERVATORY",
    tier: "featured",
    accent: "#FF3D8A",
    silhouette: "M50 11 C59 7 69 13 71 21 C73 29 67 37 60 39 L58 51 C62 57 58 63 52 61 L52 73 C52 77 48 77 48 73 L48 61 C42 63 38 57 42 51 L40 39 C33 37 27 29 29 21 C31 13 41 7 50 11Z",
  },
  {
    id: 6,
    name: "ELENA VASQUEZ",
    title: "Head of Sustainability, Tesla Energy",
    topic: "Renewable Grids and the Future of Energy",
    day: "DAY 3",
    time: "14:00 — 15:30",
    venue: "GREEN ARENA",
    tier: "speaker",
    accent: "#FFB347",
    silhouette: "M50 14 C56 10 66 14 68 22 C70 30 64 38 58 40 L56 50 C60 56 56 62 50 60 L50 72 C50 76 50 76 50 72 L50 60 C44 62 40 56 44 50 L42 40 C36 38 30 30 32 22 C34 14 44 10 50 14Z",
  },
];

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const tierLabel = speaker.tier === "keynote" ? "KEYNOTE" : speaker.tier === "featured" ? "FEATURED" : "SPEAKER";

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="VIEW"
    >
      <motion.div
        className="relative overflow-hidden rounded-xl"
        style={{
          background: "rgba(12, 18, 32, 0.6)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${speaker.accent}15`,
        }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Concept portrait — abstract silhouette with glow */}
        <div
          className="relative h-56 md:h-64 overflow-hidden flex items-center justify-center"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${speaker.accent}18 0%, transparent 70%)`,
          }}
        >
          {/* Animated concentric rings */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 100 + i * 40,
                height: 100 + i * 40,
                borderColor: `${speaker.accent}${8 + i * 3}`,
              }}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                scale: hovered ? 1.1 + i * 0.05 : 1,
              }}
              transition={{
                rotate: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              }}
            />
          ))}

          {/* Abstract human silhouette */}
          <svg viewBox="0 0 100 85" className="w-20 h-20 relative z-10" style={{ filter: `drop-shadow(0 0 12px ${speaker.accent}40)` }}>
            <path d={speaker.silhouette} fill={speaker.accent} opacity={0.6} />
          </svg>

          {/* Scanning line effect */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${speaker.accent}40, transparent)` }}
            animate={{ y: [-100, 200] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />

          {/* Tier badge */}
          <div
            className="absolute top-4 left-4 font-mono text-[9px] px-2 py-1 rounded-sm"
            style={{
              color: speaker.accent,
              background: `${speaker.accent}10`,
              border: `1px solid ${speaker.accent}20`,
              letterSpacing: "0.12em",
            }}
          >
            {tierLabel}
          </div>

          {/* Day badge */}
          <div
            className="absolute top-4 right-4 font-mono text-[9px] px-2 py-1 rounded-sm"
            style={{
              color: "rgba(234, 242, 255, 0.5)",
              background: "rgba(12, 18, 32, 0.6)",
              letterSpacing: "0.1em",
            }}
          >
            {speaker.day}
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${speaker.accent}08 0%, transparent 70%)`,
            }}
            animate={{ opacity: hovered ? 1 : 0 }}
          />
        </div>

        {/* Info section */}
        <div className="p-5">
          <div className="font-mono text-[9px] mb-2" style={{ color: `${speaker.accent}80`, letterSpacing: "0.12em" }}>
            {speaker.time} // {speaker.venue}
          </div>

          <h3
            className="font-display text-lg font-bold mb-1"
            style={{ color: "#EAF2FF" }}
          >
            {speaker.name}
          </h3>

          <div className="font-body text-xs text-ice-dim mb-3" style={{ lineHeight: 1.4 }}>
            {speaker.title}
          </div>

          <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${speaker.accent}30, transparent)` }} />

          <p className="font-body text-xs text-ice-dim/70 leading-relaxed">
            {speaker.topic}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Speakers() {
  return (
    <PortfolioSection
      label="SPEAKERS // THE MINDS SHAPING TOMORROW"
      heading="VOICES OF THE MULTIVERSE"
      headingGradient="linear-gradient(135deg, #4CE0D2, #FF3D8A)"
      description="Three days of groundbreaking talks from the brightest minds in AI, robotics, space technology, quantum computing, and sustainability."
      accent="#4CE0D2"
      index={5}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {speakers.map((speaker, i) => (
          <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-xs text-ice-dim/50 mb-4" style={{ letterSpacing: "0.1em" }}>
          MORE SPEAKERS ANNOUNCED CLOSER TO THE EVENT
        </p>
        <div className="h-px w-16 mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(76,224,210,0.3), transparent)" }} />
      </motion.div>
    </PortfolioSection>
  );
}

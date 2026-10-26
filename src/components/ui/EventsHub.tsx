"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

interface Event {
  icon: string;
  category: string;
  title: string;
  day: string;
  time: string;
  description: string;
  venue: string;
  accent: string;
}

const events: Event[] = [
  { icon: "◈", category: "CONFERENCE", title: "AI Summit", day: "DAY 1", time: "10:00 — 18:00", description: "Keynotes from leading AI researchers. Live demonstrations of frontier models. Panel discussions on safety, alignment, and the next frontier.", venue: "AUDITORIUM A", accent: "#4CE0D2" },
  { icon: "⬡", category: "COMPETITION", title: "Robowars", day: "DAY 2", time: "09:00 — 17:00", description: "30kg combat robots. Last machine standing wins. Autonomous and driver-controlled categories. Metal flies.", venue: "MAIN ARENA", accent: "#5B8DEF" },
  { icon: "⟐", category: "HACKATHON", title: "HackFest 36h", day: "DAY 1-2", time: "18:00 — 18:00+1", description: "36-hour build sprint. 500 teams. Real problems, real prizes. Ship something that matters.", venue: "INNOVATION HUB", accent: "#8B5CF6" },
  { icon: "✦", category: "WORKSHOP", title: "Orbital Mechanics Workshop", day: "DAY 3", time: "11:00 — 14:00", description: "Hands-on satellite design. Simulate orbital transfers. Launch window calculations. Build a cubesat prototype.", venue: "SPACE LAB", accent: "#6366F1" },
  { icon: "⟐", category: "WORKSHOP", title: "Quantum Computing Lab", day: "DAY 2", time: "14:00 — 17:00", description: "Real quantum hardware access. Implement Shor's algorithm. Error correction deep-dive. No prior quantum experience required.", venue: "QUANTUM WING", accent: "#FF3D8A" },
  { icon: "◉", category: "CEREMONY", title: "Closing Ceremony", day: "DAY 3", time: "19:00 — 22:00", description: "Awards. Performances. The announcement of Techfest 2028. Three days compressed into one unforgettable night.", venue: "GRAND AMPHITHEATRE", accent: "#FFB347" },
];

function EventCard({ event, index }: { event: Event; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="EXPLORE"
    >
      <motion.div
        className="relative overflow-hidden rounded-xl p-6 md:p-8 cursor-pointer"
        style={{
          background: "rgba(12, 18, 32, 0.5)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${event.accent}12`,
        }}
        whileHover={{
          y: -6,
          borderColor: `${event.accent}30`,
          boxShadow: `0 20px 60px ${event.accent}10, 0 0 40px ${event.accent}05`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${event.accent}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Category + Icon row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" style={{ color: event.accent }}>{event.icon}</span>
            <span className="font-mono text-[9px]" style={{ color: `${event.accent}80`, letterSpacing: "0.15em" }}>
              {event.category}
            </span>
          </div>
          <span className="font-mono text-[9px] text-ice-dim/40" style={{ letterSpacing: "0.1em" }}>
            {event.day}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl font-bold text-ice mb-2">{event.title}</h3>

        {/* Time */}
        <div className="font-mono text-xs text-ice-dim/50 mb-3" style={{ letterSpacing: "0.08em" }}>
          {event.time}
        </div>

        {/* Description */}
        <p className="font-body text-sm text-ice-dim/60 leading-relaxed mb-4">{event.description}</p>

        {/* Venue */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: event.accent, opacity: 0.5 }} />
          <span className="font-mono text-[10px] text-ice-dim/40" style={{ letterSpacing: "0.1em" }}>
            {event.venue}
          </span>
        </div>

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${event.accent}08 0%, transparent 60%)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Corner accent */}
        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${event.accent}15 50%)`,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function EventsHub() {
  return (
    <PortfolioSection
      label="EVENTS HUB // EXPLORE THE PROGRAMME"
      heading="DISCOVER WHAT AWAITS"
      headingGradient="linear-gradient(135deg, #4CE0D2, #8B5CF6)"
      description="From AI keynotes to 36-hour hackathons. From quantum labs to cultural nights. Three days that redefine what technology can be."
      accent="#4CE0D2"
      index={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {events.map((event, i) => (
          <EventCard key={event.title} event={event} index={i} />
        ))}
      </div>
    </PortfolioSection>
  );
}

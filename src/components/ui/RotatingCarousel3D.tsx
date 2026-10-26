"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   3D ROTATING CAROUSEL — Flash Cards in a Circle
   
   Each content section is a flash card face positioned around
   a cylinder. Scroll rotates the cylinder. The active card
   faces the viewer and can be clicked to expand full-screen.
   ============================================================ */

interface CardData {
  id: string;
  label: string;
  heading: string;
  icon: string;
  accent: string;
  description: string;
  details: string[];
  gradient: string;
}

const cards: CardData[] = [
  {
    id: "about",
    label: "01 // ABOUT",
    heading: "THE FUTURE UNFOLDS",
    icon: "◈",
    accent: "#4CE0D2",
    description: "Asia's largest science festival. Three days. 100K+ minds. 42 nations.",
    details: ["100,000+ Attendees", "500+ Events", "42 Nations", "25+ Years"],
    gradient: "linear-gradient(135deg, rgba(76,224,210,0.15), rgba(139,92,246,0.08))",
  },
  {
    id: "events",
    label: "02 // EVENTS",
    heading: "DISCOVER WHAT AWAITS",
    icon: "⬡",
    accent: "#8B5CF6",
    description: "AI keynotes, 36-hour hackathons, quantum labs, cultural nights.",
    details: ["AI Summit", "HackFest 36h", "Quantum Lab", "Closing Ceremony"],
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(255,61,138,0.08))",
  },
  {
    id: "competitions",
    label: "03 // COMPETITIONS",
    heading: "ENTER THE PORTALS",
    icon: "⟐",
    accent: "#FF3D8A",
    description: "Battle for supremacy. From coding marathons to drone races.",
    details: ["₹5,00,000 Prize Pool", "6 Categories", "Global Teams", "Live Arena"],
    gradient: "linear-gradient(135deg, rgba(255,61,138,0.15), rgba(255,179,71,0.08))",
  },
  {
    id: "robowars",
    label: "04 // ROBOWARS",
    heading: "THE BATTLEFIELD",
    icon: "⚙",
    accent: "#5B8DEF",
    description: "30kg combat robots. Last machine standing wins.",
    details: ["30kg Class", "Autonomous", "Driver-Controlled", "Live Arena"],
    gradient: "linear-gradient(135deg, rgba(91,141,239,0.15), rgba(76,224,210,0.08))",
  },
  {
    id: "exhibition",
    label: "05 // EXHIBITION",
    heading: "THE EXHIBITION FLOOR",
    icon: "✦",
    accent: "#FFB347",
    description: "8+ booths. Hardware, quantum, AI, space, neuroscience.",
    details: ["8+ Booths", "9 Categories", "Live Demos", "Interactive"],
    gradient: "linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,61,138,0.08))",
  },
  {
    id: "gallery",
    label: "06 // GALLERY",
    heading: "FLOATING MEMORIES",
    icon: "◉",
    accent: "#6366F1",
    description: "12 concept visuals from the Sentient Multiverse.",
    details: ["12 Visions", "Geometric Art", "Lightbox View", "Concept Visuals"],
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
  },
  {
    id: "speakers",
    label: "07 // SPEAKERS",
    heading: "VOICES OF THE MULTIVERSE",
    icon: "◎",
    accent: "#E879F9",
    description: "Keynotes and featured speakers from the frontier of technology.",
    details: ["3 Keynotes", "2 Featured", "AI + Robotics + Space", "Live Q&A"],
    gradient: "linear-gradient(135deg, rgba(232,121,249,0.15), rgba(91,141,239,0.08))",
  },
  {
    id: "sponsors",
    label: "08 // SPONSORS",
    heading: "POWERED BY STARS",
    icon: "◆",
    accent: "#FFB347",
    description: "The alliance of visionary partners powering the multiverse.",
    details: ["Title Sponsors", "Platinum Partners", "Gold Alliance", "Silver Network"],
    gradient: "linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,255,255,0.05))",
  },
  {
    id: "schedule",
    label: "09 // SCHEDULE",
    heading: "RIVER OF TIME",
    icon: "▲",
    accent: "#4CE0D2",
    description: "Three days. Morning to night. Drag to explore the timeline.",
    details: ["Day 1 — Ignition", "Day 2 — Collision", "Day 3 — Convergence", "MY JOURNEY"],
    gradient: "linear-gradient(135deg, rgba(76,224,210,0.15), rgba(99,102,241,0.08))",
  },
  {
    id: "timeline",
    label: "10 // HISTORY",
    heading: "A DECADE OF TOMORROW",
    icon: "◇",
    accent: "#8B5CF6",
    description: "10 years of Techfest milestones. From 2022 to 2027.",
    details: ["2022 — Genesis", "2024 — Expansion", "2026 — Fusion", "2027 — Convergence"],
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(76,224,210,0.08))",
  },
  {
    id: "impact",
    label: "11 // REGISTER",
    heading: "WHERE THE FUTURE BECOMES REAL",
    icon: "★",
    accent: "#FF3D8A",
    description: "January 16-18, 2027. IIT Bombay. Enter the multiverse.",
    details: ["JAN 16-18, 2027", "IIT BOMBAY", "100K+ ATTENDEES", "REGISTER NOW"],
    gradient: "linear-gradient(135deg, rgba(255,61,138,0.15), rgba(139,92,246,0.08))",
  },
];

/* Individual carousel card */
function CarouselCard({
  card,
  index,
  totalCards,
  activeIndex,
  onClick,
}: {
  card: CardData;
  index: number;
  totalCards: number;
  activeIndex: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D position in the cylinder
  const angleStep = 360 / totalCards;
  const angle = angleStep * index;
  const isActive = index === activeIndex;
  const radius = Math.max(420, 320 + totalCards * 18);

  // Mouse-based tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  // Determine visibility (show cards within ±2 of active)
  const diff = Math.abs(index - activeIndex);
  const wrappedDiff = Math.min(diff, totalCards - diff);
  const isVisible = wrappedDiff <= 2;

  return (
    <motion.div
      ref={cardRef}
      className="absolute cursor-pointer"
      style={{
        width: 520,
        height: 340,
        left: "50%",
        top: "50%",
        marginLeft: -260,
        marginTop: -170,
        transformStyle: "preserve-3d",
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        opacity: isVisible ? (isActive ? 1 : wrappedDiff === 1 ? 0.7 : 0.35) : 0,
        pointerEvents: isVisible ? "auto" : "none",
        zIndex: isActive ? 10 : 5 - wrappedDiff,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onClick={onClick}
      data-cursor="EXPLORE"
      animate={{
        scale: isActive ? 1 : 0.85,
        rotateX: hovered ? mousePos.y * -8 : 0,
        rotateY: hovered ? mousePos.x * 8 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Card surface */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: card.gradient,
          border: `1px solid ${card.accent}${isActive ? "30" : "10"}`,
          boxShadow: isActive
            ? `0 0 60px ${card.accent}15, 0 0 120px ${card.accent}08, inset 0 1px 0 ${card.accent}10`
            : `0 10px 40px rgba(0,0,0,0.3)`,
          backdropFilter: "blur(40px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Reflective surface layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${135 + mousePos.x * 30}deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.accent}${isActive ? "60" : "20"}, transparent)`,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          {/* Header row */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-mono text-[10px] tracking-[0.25em]"
                style={{ color: `${card.accent}90` }}
              >
                {card.label}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: `${card.accent}60` }}
              >
                {String(index + 1).padStart(2, "0")}/{String(totalCards).padStart(2, "0")}
              </span>
            </div>

            {/* Icon */}
            <div
              className="text-4xl mb-4"
              style={{
                color: card.accent,
                filter: `drop-shadow(0 0 12px ${card.accent}40)`,
              }}
            >
              {card.icon}
            </div>

            {/* Heading */}
            <h3
              className="font-display text-2xl md:text-3xl font-bold leading-tight mb-3"
              style={{ color: "#EAF2FF" }}
            >
              {card.heading}
            </h3>

            {/* Description */}
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: `${card.accent}90` }}>
              {card.description}
            </p>
          </div>

          {/* Bottom row: details */}
          <div className="flex flex-wrap gap-2">
            {card.details.map((detail, di) => (
              <span
                key={di}
                className="font-mono text-[9px] tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  background: `${card.accent}10`,
                  color: `${card.accent}CC`,
                  border: `1px solid ${card.accent}15`,
                }}
              >
                {detail}
              </span>
            ))}
          </div>
        </div>

        {/* Corner glow on active */}
        {isActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 0% 0%, ${card.accent}08 0%, transparent 50%)`,
            }}
          />
        )}

        {/* Scan line on hover */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${card.accent}40, transparent)` }}
          animate={hovered ? { top: ["0%", "100%"], opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

/* Main Carousel Component */
export default function RotatingCarousel3D({ onSectionClick }: { onSectionClick?: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const scrollAccum = useRef(0);
  const isAnimating = useRef(false);
  const lastScrollTime = useRef(0);
  const totalCards = cards.length;
  const angleStep = 360 / totalCards;

  // Handle wheel scroll to rotate carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only rotate if the carousel section is visible
      const now = Date.now();
      const delta = Math.abs(e.deltaY);

      if (delta < 15) return; // Ignore tiny scrolls

      // Debounce: lock for 600ms after a rotation
      if (isAnimating.current) return;
      if (now - lastScrollTime.current < 600) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = (activeIndex + direction + totalCards) % totalCards;

      isAnimating.current = true;
      lastScrollTime.current = now;
      setActiveIndex(nextIndex);
      setRotationAngle((prev) => prev - direction * angleStep);

      setTimeout(() => {
        isAnimating.current = false;
      }, 650);
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [activeIndex, angleStep, totalCards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalCards);
        setRotationAngle((prev) => prev - angleStep);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
        setRotationAngle((prev) => prev + angleStep);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [angleStep, totalCards]);

  // Touch/swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        setActiveIndex((prev) => (prev + direction + totalCards) % totalCards);
        setRotationAngle((prev) => prev - direction * angleStep);
      }
    },
    [angleStep, totalCards]
  );

  const goToCard = useCallback(
    (index: number) => {
      const direction = index > activeIndex ? 1 : -1;
      const steps = Math.abs(index - activeIndex);
      setActiveIndex(index);
      setRotationAngle((prev) => prev - direction * angleStep * steps);
    },
    [activeIndex, angleStep]
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(12,18,32,0.95) 0%, #05060A 70%)",
        perspective: 1400,
        perspectiveOrigin: "50% 50%",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${cards[activeIndex].accent}06 0%, transparent 60%)`,
          transition: "background 1s ease",
        }}
      />

      {/* Section header */}
      <div className="relative z-20 text-center mb-8">
        <motion.div
          className="font-mono text-[10px] tracking-[0.3em] mb-3"
          style={{ color: `${cards[activeIndex].accent}80` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          NAVIGATE THE MULTIVERSE
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
          <span style={{ color: "#EAF2FF" }}>SCROLL OR </span>
          <span
            style={{
              background: `linear-gradient(135deg, ${cards[activeIndex].accent}, ${cards[(activeIndex + 1) % totalCards].accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SWIPE
          </span>
          <span style={{ color: "#EAF2FF" }}> TO EXPLORE</span>
        </h2>
      </div>

      {/* 3D Carousel container */}
      <div
        className="relative"
        style={{
          width: 520,
          height: 340,
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotationAngle}deg)`,
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          // No overflow:visible needed on this — cards are absolute inside preserve-3d
        }}
      >
        {cards.map((card, i) => (
          <CarouselCard
            key={card.id}
            card={card}
            index={i}
            totalCards={totalCards}
            activeIndex={activeIndex}
            onClick={() => onSectionClick?.(card.id)}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div className="relative z-20 flex items-center gap-2 mt-10">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => goToCard(i)}
            className="group relative"
            data-cursor="SELECT"
          >
            <div
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === activeIndex ? card.accent : `${card.accent}30`,
                boxShadow: i === activeIndex ? `0 0 8px ${card.accent}60` : "none",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
            {/* Tooltip */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: card.accent }}
            >
              {card.label.split("//")[1]?.trim() || card.label}
            </div>
          </button>
        ))}
      </div>

      {/* Active card indicator */}
      <div className="relative z-20 mt-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[11px] tracking-[0.15em]"
            style={{ color: `${cards[activeIndex].accent}70` }}
          >
            {cards[activeIndex].label}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow hints */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => {
            setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
            setRotationAngle((prev) => prev + angleStep);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${cards[activeIndex].accent}20`,
          }}
          data-cursor="←"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke={cards[activeIndex].accent} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => {
            setActiveIndex((prev) => (prev + 1) % totalCards);
            setRotationAngle((prev) => prev - angleStep);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${cards[activeIndex].accent}20`,
          }}
          data-cursor="→"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke={cards[activeIndex].accent} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

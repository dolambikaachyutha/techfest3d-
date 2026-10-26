"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useAppStore, selectIsBooted, selectCurrentSection } from "@/lib/store";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HeroOverlay from "@/components/ui/HeroOverlay";
import Nav from "@/components/ui/Nav";
import Background from "@/components/ui/Background";
import CursorFollower from "@/components/ui/CursorFollower";
import SectionLabel from "@/components/ui/SectionLabel";
import HologramInfoPanel from "@/components/ui/HologramInfoPanel";
import EventsHub from "@/components/ui/EventsHub";
import CompetitionsGalaxy from "@/components/ui/CompetitionsGalaxy";
import SponsorsUniverse from "@/components/ui/SponsorsUniverse";
import TimelineTunnel from "@/components/ui/TimelineTunnel";
import SectionFlashCards from "@/components/ui/SectionFlashCards";
import RegistrationFlow from "@/components/ui/RegistrationFlow";
import WorldSelector from "@/components/ui/WorldSelector";
import NovaAI from "@/components/ui/NovaAI";
import AchievementSystem from "@/components/ui/AchievementSystem";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Gallery from "@/components/ui/Gallery";
import ScheduleTimeline from "@/components/ui/ScheduleTimeline";
import RobowarsArena from "@/components/ui/RobowarsArena";
import SearchMultiverse from "@/components/ui/SearchMultiverse";
import ReducedMotionToggle from "@/components/ui/ReducedMotionToggle";
import EasterEggs from "@/components/ui/EasterEggs";
import FooterCore from "@/components/ui/FooterCore";
import ExhibitionCity from "@/components/ui/ExhibitionCity";
import MobileNav from "@/components/ui/MobileNav";
import AudioSystem from "@/components/ui/AudioSystem";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Speakers from "@/components/ui/Speakers";
import SentientIdle from "@/components/ui/SentientIdle";
import AboutSection from "@/components/ui/AboutSection";
import ImpactCTA from "@/components/ui/ImpactCTA";
import RotatingCarousel3D from "@/components/ui/RotatingCarousel3D";

const Experience = dynamic(
  () => import("@/components/canvas/Experience"),
  { ssr: false }
);

/** Subtle section divider — a thin glowing line */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="w-24 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(76,224,210,0.2), transparent)",
        }}
      />
    </div>
  );
}

/**
 * Architecture:
 * 1. Fixed 3D canvas (z-0) covers the viewport
 * 2. Fixed UI overlays (z-10..z-30) for hero, flash cards, nav
 * 3. Normal document flow content BELOW the spacer — scrolls naturally
 *    over the canvas via background: transparent + z-20
 * 4. The spacer (900vh) gives the 3D journey room to scroll
 * 5. After the spacer, the content modules appear in normal flow
 */
export default function Home() {
  const isBooted = useAppStore(selectIsBooted);
  const [regOpen, setRegOpen] = useState(false);
  const [worldOpen, setWorldOpen] = useState(false);

  return (
    <SmoothScroll>
    <main className="relative">
      {/* Fixed 3D canvas */}
      <Background />
      <Experience />

      {/* Fixed overlays — always on top */}
      <CursorFollower />
      <AnimatePresence>
        {!isBooted && <LoadingScreen />}
      </AnimatePresence>
      <HeroOverlay />
      <SectionLabel />
      <SectionFlashCards />
      <HologramInfoPanel />
      {isBooted && (
        <Nav
          onRegister={() => setRegOpen(true)}
          onExplore={() => setWorldOpen(true)}
        />
      )}

      {/* 3D journey spacer — drives scroll for the camera */}
      <div style={{ height: "1200vh", pointerEvents: "none" }} />

      {/* Content modules — normal document flow, scrolls OVER the fixed canvas */}
      <div className="relative z-20" style={{ pointerEvents: "auto" }}>
        <div
          className="w-full"
          style={{
            background: "#05060A",
          }}
        >
          {/* Transition from 3D world — gradual fade-in zone */}
          <div className="relative h-32">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, transparent, #05060A)",
              }}
            />
          </div>

          {/* === 3D ROTATING CAROUSEL — all sections as flash cards in a circle === */}
          <RotatingCarousel3D
            onSectionClick={(id) => {
              // Scroll to full content if a card is clicked
              const el = document.getElementById(`section-${id}`);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* === FULL CONTENT SECTIONS (scrollable portfolio pages) === */}
          <div id="section-about"><AboutSection /></div>
          <div id="section-events"><EventsHub /></div>
          <div id="section-competitions"><CompetitionsGalaxy /></div>
          <div id="section-robowars"><RobowarsArena /></div>
          <div id="section-exhibition"><ExhibitionCity /></div>
          <div id="section-gallery"><Gallery /></div>
          <div id="section-speakers"><Speakers /></div>
          <div id="section-sponsors"><SponsorsUniverse /></div>
          <div id="section-schedule"><ScheduleTimeline /></div>
          <div id="section-timeline"><TimelineTunnel /></div>
          <div id="section-footer"><FooterCore /></div>
          <div id="section-impact"><ImpactCTA /></div>
        </div>
      </div>

      <MobileNav onRegister={() => setRegOpen(true)} onExplore={() => setWorldOpen(true)} />
      <RegistrationFlow isOpen={regOpen} onClose={() => setRegOpen(false)} />
      <WorldSelector isOpen={worldOpen} onClose={() => setWorldOpen(false)} />
      <NovaAI />
      <AchievementSystem />
      <SearchMultiverse />
      <AudioSystem />
      <ReducedMotionToggle />
      <EasterEggs />
      <SentientIdle />
    </main>
    </SmoothScroll>
  );
}

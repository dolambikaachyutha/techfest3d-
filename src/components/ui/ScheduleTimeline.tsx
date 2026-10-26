"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

interface ScheduleEvent {
  id: number;
  name: string;
  time: string;
  venue: string;
  category: string;
  color: string;
  day: 1 | 2 | 3;
  added: boolean;
}

const scheduleData: ScheduleEvent[] = [
  { id: 1, name: "Opening Ceremony", time: "09:00", venue: "Main Auditorium", category: "CEREMONY", color: "#FFB347", day: 1, added: false },
  { id: 2, name: "AI Challenge Round 1", time: "10:30", venue: "Hall A", category: "AI", color: "#4CE0D2", day: 1, added: false },
  { id: 3, name: "HackFest Kickoff", time: "11:00", venue: "Hack Zone", category: "HACKATHON", color: "#5B8DEF", day: 1, added: false },
  { id: 4, name: "Robowars Qualifiers", time: "14:00", venue: "Arena", category: "ROBOTICS", color: "#FF3D8A", day: 1, added: false },
  { id: 5, name: "Space Tech Workshop", time: "15:30", venue: "Lab 3", category: "WORKSHOP", color: "#6366F1", day: 1, added: false },
  { id: 6, name: "Technoholix Night 1", time: "19:00", venue: "Open Air Theatre", category: "CULTURAL", color: "#FF3D8A", day: 1, added: false },
  { id: 7, name: "AI Summit", time: "09:00", venue: "Main Auditorium", category: "AI", color: "#4CE0D2", day: 2, added: false },
  { id: 8, name: "Robowars Finals", time: "11:00", venue: "Arena", category: "ROBOTICS", color: "#FF3D8A", day: 2, added: false },
  { id: 9, name: "Exhibition Open", time: "10:00", venue: "Convention Hall", category: "EXHIBITION", color: "#8B5CF6", day: 2, added: false },
  { id: 10, name: "Startup Showcase", time: "14:00", venue: "Innovation Hub", category: "STARTUP", color: "#22C55E", day: 2, added: false },
  { id: 11, name: "Quantum Computing Workshop", time: "15:00", venue: "Lab 2", category: "WORKSHOP", color: "#6366F1", day: 2, added: false },
  { id: 12, name: "Technoholix Night 2", time: "19:00", venue: "Open Air Theatre", category: "CULTURAL", color: "#FF3D8A", day: 2, added: false },
  { id: 13, name: "HackFest Judging", time: "09:00", venue: "Hack Zone", category: "HACKATHON", color: "#5B8DEF", day: 3, added: false },
  { id: 14, name: "Guest Lecture: Future of AI", time: "11:00", venue: "Main Auditorium", category: "LECTURE", color: "#4CE0D2", day: 3, added: false },
  { id: 15, name: "Prize Distribution", time: "16:00", venue: "Main Auditorium", category: "CEREMONY", color: "#FFB347", day: 3, added: false },
  { id: 16, name: "Closing Ceremony", time: "18:00", venue: "Open Air Theatre", category: "CEREMONY", color: "#FFB347", day: 3, added: false },
];

const dayLabels = ["DAY 1 // JAN 16", "DAY 2 // JAN 17", "DAY 3 // JAN 18"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export default function ScheduleTimeline() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [myEvents, setMyEvents] = useState<Set<number>>(new Set());
  const [showMySchedule, setShowMySchedule] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filteredEvents = scheduleData.filter((e) => e.day === activeDay);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (timelineRef.current?.offsetLeft || 0);
    scrollLeft.current = timelineRef.current?.scrollLeft || 0;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !timelineRef.current) return;
    e.preventDefault();
    const x = e.pageX - (timelineRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    timelineRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const toggleEvent = (id: number) => {
    setMyEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const eventsToShow = showMySchedule
    ? scheduleData.filter((e) => myEvents.has(e.id))
    : filteredEvents;

  return (
    <PortfolioSection
      label="SCHEDULE // TEMPORAL CONTROL"
      heading="RIVER OF TIME"
      headingGradient="linear-gradient(135deg, #FFB347, #FF3D8A)"
      description="DRAG HORIZONTALLY THROUGH TIME. TAP TO ADD EVENTS TO YOUR JOURNEY."
      accent="#FFB347"
      index={6}
      fullScreen={false}
    >
      {/* Day tabs */}
      <div className="max-w-6xl mx-auto flex gap-2 mb-8">
        {dayLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => { setActiveDay((i + 1) as 1 | 2 | 3); setShowMySchedule(false); }}
            className={`font-mono text-[10px] px-4 py-2 rounded border transition-all duration-300 cursor-pointer ${
              activeDay === i + 1 && !showMySchedule
                ? "border-signal-cyan/50 text-signal-cyan bg-signal-cyan/5"
                : "border-circuit-line text-ice-dim hover:border-signal-cyan/30 hover:text-ice"
            }`}
            style={{ letterSpacing: "0.08em" }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowMySchedule(!showMySchedule)}
          className={`font-mono text-[10px] px-4 py-2 rounded border transition-all duration-300 cursor-pointer ml-auto ${
            showMySchedule
              ? "border-quantum-violet/50 text-quantum-violet bg-quantum-violet/5"
              : "border-circuit-line text-ice-dim hover:border-quantum-violet/30"
          }`}
          style={{ letterSpacing: "0.08em" }}
        >
          MY JOURNEY ({myEvents.size})
        </button>
      </div>

      {/* Timeline — horizontal drag */}
      <div
        ref={timelineRef}
        className="max-w-6xl mx-auto overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ userSelect: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-0 min-w-max pb-4">
          {timeSlots.map((time) => {
            const eventsAtTime = eventsToShow.filter((e) => e.time === time);
            return (
              <div key={time} className="flex-shrink-0 w-48 border-l border-circuit-line relative">
                {/* Time marker */}
                <div className="font-mono text-[9px] text-ice-dim px-3 py-2 border-b border-circuit-line" style={{ letterSpacing: "0.1em" }}>
                  {time}
                </div>
                {/* Events */}
                <div className="min-h-[120px] p-2 space-y-2">
                  {eventsAtTime.map((event) => (
                    <motion.div
                      key={event.id}
                      className="rounded-lg p-3 cursor-pointer group relative"
                      style={{
                        background: `${event.color}08`,
                        border: `1px solid ${event.color}20`,
                      }}
                      whileHover={{
                        scale: 1.03,
                        borderColor: `${event.color}50`,
                        boxShadow: `0 0 20px ${event.color}15`,
                      }}
                      onClick={() => toggleEvent(event.id)}
                      data-cursor={myEvents.has(event.id) ? "REMOVE" : "ADD TO JOURNEY"}
                    >
                      {/* Added indicator */}
                      {myEvents.has(event.id) && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                      )}
                      <div className="font-mono text-[8px] mb-1" style={{ color: event.color, letterSpacing: "0.1em" }}>
                        {event.category}
                      </div>
                      <div className="font-display text-xs text-ice font-bold leading-tight">
                        {event.name}
                      </div>
                      <div className="font-mono text-[8px] text-ice-dim mt-1" style={{ letterSpacing: "0.05em" }}>
                        {event.venue}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag hint */}
      <div className="max-w-6xl mx-auto mt-4 text-center">
        <div className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
          ← DRAG TO TRAVEL THROUGH TIME →
        </div>
      </div>
    </PortfolioSection>
  );
}

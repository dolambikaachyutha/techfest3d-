"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CursorState {
  label: string;
  isHovering: boolean;
  isClicking: boolean;
}

export default function CursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>({
    label: "",
    isHovering: false,
    isClicking: false,
  });
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 200, damping: 20, mass: 0.3 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 20, mass: 0.3 });
  const ringX = useSpring(cursorX, { stiffness: 80, damping: 15, mass: 0.8 });
  const ringY = useSpring(cursorY, { stiffness: 80, damping: 15, mass: 0.8 });
  const labelX = useSpring(cursorX, { stiffness: 120, damping: 18, mass: 0.5 });
  const labelY = useSpring(cursorY, { stiffness: 120, damping: 18, mass: 0.5 });

  const velocity = useRef({ lastX: 0 });
  const rawStretchX = useMotionValue(0);
  const stretchX = useSpring(rawStretchX, { stiffness: 200, damping: 20 });
  const scaleXVal = useTransform(stretchX, (v) => 1 + v);

  const trailPoints = useRef<{ x: number; y: number; id: number; opacity: number }[]>([]);
  const [trails, setTrails] = useState(trailPoints.current);
  const trailId = useRef(0);

  const addPulse = useCallback((x: number, y: number) => {
    trailId.current += 1;
    setPulses((prev) => [...prev.slice(-3), { id: trailId.current, x, y }]);
    setTimeout(() => {
      setPulses((prev) => prev.filter((p) => p.id !== trailId.current));
    }, 800);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isTouch = "ontouchstart" in window;
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Update stretch
      const dx = e.clientX - velocity.current.lastX;
      velocity.current.lastX = e.clientX;
      rawStretchX.set(Math.min(Math.max(dx * 0.15, -0.3), 0.3));

      // Magnetic labels
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const magnetic = el?.closest("[data-cursor]");
      if (magnetic) {
        setCursorState({
          label: magnetic.getAttribute("data-cursor") || "",
          isHovering: true,
          isClicking: false,
        });
      } else {
        setCursorState((prev) =>
          prev.isHovering ? { ...prev, isHovering: false, label: "" } : prev
        );
      }

      // Trail
      trailId.current += 1;
      trailPoints.current = [
        ...trailPoints.current.slice(-15),
        { x: e.clientX, y: e.clientY, id: trailId.current, opacity: 1 },
      ];
      setTrails([...trailPoints.current]);
    };

    const handleClick = (e: MouseEvent) => {
      addPulse(e.clientX, e.clientY);
      setCursorState((prev) => ({ ...prev, isClicking: true }));
      setTimeout(() => setCursorState((prev) => ({ ...prev, isClicking: false })), 200);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [mounted, cursorX, cursorY, rawStretchX, addPulse]);

  // Fade trails
  useEffect(() => {
    const interval = setInterval(() => {
      trailPoints.current = trailPoints.current
        .map((t) => ({ ...t, opacity: t.opacity - 0.08 }))
        .filter((t) => t.opacity > 0);
      setTrails([...trailPoints.current]);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const dotSize = cursorState.isHovering ? 10 : cursorState.isClicking ? 4 : 6;
  const ringSize = cursorState.isHovering ? 48 : 32;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none" aria-hidden="true">
      {/* SVG trail */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="trailG">
            <stop offset="0%" stopColor="#4CE0D2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4CE0D2" stopOpacity="0" />
          </radialGradient>
        </defs>
        {trails.map((t) => (
          <circle
            key={t.id}
            cx={t.x}
            cy={t.y}
            r={2 + (1 - t.opacity) * 6}
            fill="url(#trailG)"
            opacity={t.opacity * 0.4}
          />
        ))}
      </svg>

      {/* Click energy pulses */}
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          className="absolute rounded-full border border-signal-cyan/50"
          style={{ left: pulse.x, top: pulse.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Main cursor dot */}
      {isVisible && (
        <motion.div
          className="absolute rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            width: dotSize,
            height: dotSize,
            backgroundColor: "#4CE0D2",
            boxShadow: `0 0 ${cursorState.isHovering ? 20 : 10}px rgba(76,224,210,0.8)`,
            scaleX: scaleXVal,
          }}
          animate={{ scale: cursorState.isClicking ? 0.5 : 1 }}
          transition={{ duration: 0.15 }}
        />
      )}

      {/* Outer ring — follows with inertia */}
      {isVisible && (
        <motion.div
          className="absolute rounded-full"
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
            width: ringSize,
            height: ringSize,
            border: `1px solid ${cursorState.isHovering ? "rgba(76,224,210,0.5)" : "rgba(76,224,210,0.2)"}`,
          }}
          animate={{ scale: cursorState.isHovering ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Contextual label */}
      {isVisible && cursorState.label && (
        <motion.div
          className="absolute font-mono text-[9px] text-signal-cyan whitespace-nowrap"
          style={{ x: labelX, y: labelY, translateX: "16px", translateY: "-50%", letterSpacing: "0.15em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {cursorState.label}
        </motion.div>
      )}
    </div>
  );
}

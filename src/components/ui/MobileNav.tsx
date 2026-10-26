"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  icon: string;
  section: string;
}

const navItems: NavItem[] = [
  { label: "EVENTS", icon: "◈", section: "events" },
  { label: "COMPETITIONS", icon: "⚔", section: "competitions" },
  { label: "WORKSHOPS", icon: "⚙", section: "workshops" },
  { label: "EXHIBITIONS", icon: "◉", section: "exhibitions" },
  { label: "REGISTER", icon: "✦", section: "register" },
  { label: "SCHEDULE", icon: "◎", section: "schedule" },
];

export default function MobileNav({
  onRegister,
  onExplore,
}: {
  onRegister: () => void;
  onExplore: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (item: NavItem) => {
    setIsOpen(false);
    if (item.section === "register") {
      onRegister();
    } else if (item.section === "events" || item.section === "competitions") {
      onExplore();
    }
  };

  return (
    <>
      {/* Hamburger button — mobile only */}
      <motion.button
        className="fixed bottom-24 left-6 z-[130] md:hidden w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: "radial-gradient(circle, rgba(76,224,210,0.15) 0%, rgba(12,18,32,0.9) 70%)",
          border: "1px solid rgba(76,224,210,0.3)",
          boxShadow: isOpen
            ? "0 0 30px rgba(76,224,210,0.4)"
            : "0 0 15px rgba(76,224,210,0.15)",
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="NAVIGATE"
      >
        <motion.span
          className="text-signal-cyan text-lg"
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          {isOpen ? "✕" : "☰"}
        </motion.span>
      </motion.button>

      {/* Circular menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[128] md:hidden bg-void/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Orbiting items */}
            <div className="fixed bottom-24 left-6 z-[129] md:hidden">
              {navItems.map((item, i) => {
                const angle = (i / navItems.length) * Math.PI * 1.5 - Math.PI * 0.75;
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.button
                    key={item.label}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      left: `-${24}px`,
                      top: `-${24}px`,
                      background: "rgba(12, 18, 32, 0.9)",
                      border: "1px solid rgba(76, 224, 210, 0.25)",
                    }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{ opacity: 1, x, y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleAction(item)}
                    data-cursor={item.label}
                  >
                    <span className="text-signal-cyan text-sm">{item.icon}</span>
                    {/* Label below */}
                    <motion.span
                      className="absolute top-full mt-1 font-mono text-[7px] text-ice-dim whitespace-nowrap"
                      style={{ letterSpacing: "0.08em" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.button>
                );
              })}

              {/* Center glow */}
              <motion.div
                className="absolute w-20 h-20 rounded-full"
                style={{
                  left: "-40px",
                  top: "-40px",
                  background: "radial-gradient(circle, rgba(76,224,210,0.1) 0%, transparent 70%)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
